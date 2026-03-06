'use server'

import {
  AffiliateStatus,
  OrderStatus,
  PayoutStatus,
  StockMovementType,
} from '@prisma/client'
import { DeliveryType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

import type { AffiliateFilter, GetAffiliateOrdersOptions } from './order.types'
import type { Prisma, Currency } from '@prisma/client'

import { buildStatusUpdateData } from './order.helper'
import { calculateShippingCost } from '../shipping/shipping.action'

import { AFFILIATE_CONFIG } from '@/constants'
import { getOrderContent, OrderTemplate } from '@/emails/OrderTemplate'
import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { getServerUser, withAuth } from '@/lib/session'
import { canTransitionOrderStatus, formatFullAddress } from '@/utils'
import { sendEmail } from '@/utils/email-sender'
import { decimalToNumber } from '@/utils/number'
import { getProductPriceInfo } from '@/utils/product-price'

interface GetOrdersOptions {
  page?: number
  limit?: number
  userId?: string
}

interface UpdateOrderInput {
  orderId: string
  status: OrderStatus
  reason?: string
  trackingWebsite?: string
  trackingNumber?: string
}

interface CreateOrderInput {
  items: { productId: string; variantId?: string | null; quantity: number }[]
  deliveryType: DeliveryType
  addressId?: string
  storefrontId?: string
  pickupDate?: string | Date
  currency: Currency
  exchangeRate: number
  exchangeLocale: string
  referrerId?: string
}

type TransactionClient = Prisma.TransactionClient

const CANCEL_OR_REFUND_STATUSES = new Set<OrderStatus>([
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
])

const getAffiliateOrders = async (options: GetAffiliateOrdersOptions = {}) =>
  withAuth(async () => {
    const { userId } = await getServerUser()
    const { page = 1, limit = 10, startDate, endDate } = options
    const skip = (page - 1) * limit

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referrerCode: true },
    })

    if (!user?.referrerCode) {
      return ok({ items: [], total: 0, totalPages: 0 })
    }

    const where: Prisma.OrderWhereInput = {
      referrerCode: user.referrerCode,
    }

    if (startDate || endDate) {
      where.createdAt = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      }
    }

    const [items, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    const formattedItems = items.map((item) => {
      const amount = Number(item.baseTotal)
      const commissionRate =
        amount > AFFILIATE_CONFIG.THRESHOLD_AMOUNT
          ? AFFILIATE_CONFIG.HIGH_COMMISSION_RATE
          : AFFILIATE_CONFIG.LOW_COMMISSION_RATE

      return {
        ...decimalToNumber(item),
        commissionRate,
        estimatedEarnings: Number((amount * commissionRate).toFixed(2)),
      }
    })

    return ok({
      items: formattedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  })

const getAffiliateStats = async (filter?: AffiliateFilter) =>
  withAuth(async () => {
    const { userId } = await getServerUser()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referrerCode: true },
    })

    if (!user?.referrerCode) {
      return ok({
        totalOrders: 0,
        totalRevenue: 0,
        totalCommission: 0,
      })
    }

    const whereClause: Prisma.OrderWhereInput = {
      referrerCode: user.referrerCode,
      status: OrderStatus.DELIVERED,
    }

    if (filter?.startDate || filter?.endDate) {
      whereClause.createdAt = {
        ...(filter.startDate && { gte: new Date(filter.startDate) }),
        ...(filter.endDate && { lte: new Date(filter.endDate) }),
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      select: {
        baseTotal: true,
      },
    })

    let totalRevenue = 0
    let totalCommission = 0

    orders.forEach((order) => {
      const amount = Number(order.baseTotal)
      totalRevenue += amount

      const commissionRate =
        amount > AFFILIATE_CONFIG.THRESHOLD_AMOUNT
          ? AFFILIATE_CONFIG.HIGH_COMMISSION_RATE
          : AFFILIATE_CONFIG.LOW_COMMISSION_RATE
      totalCommission += amount * commissionRate
    })

    return ok({
      totalOrders: orders.length,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalCommission: Number(totalCommission.toFixed(2)),
    })
  })

const sendOrderEmail = async (orderId: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        user: { select: { email: true } },
      },
    })

    if (!order) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    const emailTo = order.user?.email
    if (!emailTo) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    const { subject } = getOrderContent(order.status, order.id)

    const result = await sendEmail({
      to: emailTo,
      subject,
      react: OrderTemplate({ order }),
    })

    return result.success ? ok() : fail(ERROR_CODES.BAD_REQUEST)
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

const processStockMovement = async (
  tx: TransactionClient,
  params: {
    productId: string
    variantId?: string | null
    quantity: number
    type: StockMovementType
    orderId: string
    direction: 'increment' | 'decrement'
  },
) => {
  const { productId, variantId, quantity, type, orderId, direction } = params
  const isIncrement = direction === 'increment'
  const amount = isIncrement ? quantity : -quantity

  const whereFilter = {
    id: variantId || productId,
    ...(direction === 'decrement' && { stockQuantity: { gte: quantity } }),
  }

  const updateData = {
    stockQuantity: isIncrement
      ? { increment: quantity }
      : { decrement: quantity },
  }

  let updatedCount = 0

  if (variantId) {
    const result = await tx.productVariant.updateMany({
      where: whereFilter,
      data: updateData,
    })
    updatedCount = result.count
  } else {
    const result = await tx.product.updateMany({
      where: whereFilter,
      data: updateData,
    })
    updatedCount = result.count
  }

  if (updatedCount === 0 && direction === 'decrement') {
    throw new Error('INSUFFICIENT_STOCK')
  }

  await tx.stockHistory.create({
    data: {
      productId: variantId ? undefined : productId,
      variantId: variantId ?? undefined,
      quantity: amount,
      type,
      reference: orderId,
    },
  })
}

const getOrders = async ({
  page = 1,
  limit = 10,
  userId,
}: GetOrdersOptions = {}) => {
  const skip = (page - 1) * limit
  const where: Prisma.OrderWhereInput = userId ? { userId } : {}

  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, image: true, email: true } },
        address: { select: { countryCode: true } },
        storefront: { select: { name: true } },
        items: {
          include: {
            product: {
              select: { name: true, images: { select: { url: true } } },
            },
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ])

  return {
    items: decimalToNumber(items),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      address: true,
      storefront: true,
      items: {
        include: {
          product: {
            select: { unit: true, images: { select: { url: true } } },
          },
        },
      },
    },
  })

  return decimalToNumber(order)
}

const getOrderStats = async () => {
  const [total, pending, delivered] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
  ])

  return [
    { name: 'คำสั่งซื้อทั้งหมด', value: total },
    { name: 'รอชำระเงิน', value: pending },
    { name: 'จัดส่งสำเร็จแล้ว', value: delivered },
  ]
}

const getRevenueStats = async () => {
  const statuses = [OrderStatus.DELIVERED, OrderStatus.PENDING]

  const results = await Promise.all(
    statuses.map((s) =>
      prisma.order.aggregate({
        where: { status: s },
        _sum: { baseTotal: true },
      }),
    ),
  )

  const labels = ['รายได้สำเร็จ (THB)', 'ยอดรอชำระ (THB)']

  return results.map((res, i) => ({
    name: labels[i],
    value: Number(res._sum.baseTotal || 0),
    isCurrency: true,
  }))
}

const createOrder = async (input: CreateOrderInput) =>
  withAuth(async () => {
    const { userId } = await getServerUser()

    return prisma.$transaction(async (tx) => {
      const {
        items,
        addressId,
        storefrontId,
        deliveryType,
        pickupDate,
        currency,
        exchangeRate,
        exchangeLocale,
        referrerId,
      } = input

      let address = null
      let storefront = null

      if (deliveryType === 'SHIPPING') {
        if (!addressId) {
          return fail(ERROR_CODES.BAD_REQUEST)
        }

        address = await tx.address.findUnique({ where: { id: addressId } })

        if (!address || items.length === 0) {
          return fail(ERROR_CODES.BAD_REQUEST)
        }
      } else {
        if (!storefrontId) {
          return fail(ERROR_CODES.BAD_REQUEST)
        }

        storefront = await tx.storefront.findUnique({
          where: { id: storefrontId },
        })

        if (!storefront || items.length === 0) {
          return fail(ERROR_CODES.BAD_REQUEST)
        }
      }

      let validAffiliate = null
      let finalReferrerCode = null

      if (referrerId) {
        const affiliate = await tx.affiliateProfile.findUnique({
          where: { affiliateCode: referrerId },
          select: {
            id: true,
            status: true,
            baseRate: true,
            highValueRate: true,
            thresholdAmount: true,
          },
        })

        if (affiliate && affiliate.status === AffiliateStatus.APPROVED) {
          validAffiliate = affiliate
          finalReferrerCode = referrerId
        }
      }

      const products = await tx.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
        include: { variants: true },
      })

      const productMap = new Map(products.map((p) => [p.id, p]))
      const orderItemsPayload: Prisma.OrderItemCreateManyOrderInput[] = []
      const shippingItems: { quantity: number; weight: number }[] = []
      let totalBaseProductDiscount = 0
      let subtotalSum = 0

      for (const item of items) {
        const product = productMap.get(item.productId)

        if (!product) {
          return fail(ERROR_CODES.DATA_NOT_FOUND)
        }

        const { price: effectiveBasePrice, discountAmount } =
          getProductPriceInfo(product, item.variantId)
        const variant = item.variantId
          ? product.variants.find((v) => v.id === item.variantId)
          : null
        const priceLocal = Number(
          (effectiveBasePrice * exchangeRate).toFixed(2),
        )

        totalBaseProductDiscount += discountAmount * item.quantity
        const currentItemBaseSubtotal = effectiveBasePrice * item.quantity
        subtotalSum += currentItemBaseSubtotal

        orderItemsPayload.push({
          productId: product.id,
          variantId: item.variantId,
          productName: product.name,
          variantName: variant?.name,
          quantity: item.quantity,
          basePrice: effectiveBasePrice,
          baseSubtotal: currentItemBaseSubtotal,
          price: priceLocal,
          subtotal: priceLocal * item.quantity,
          currency,
        })

        shippingItems.push({
          quantity: item.quantity,
          weight: decimalToNumber(variant?.weight ?? product.weight ?? 0),
        })
      }

      let baseShipping = 0
      if (deliveryType === DeliveryType.SHIPPING && address) {
        baseShipping = await calculateShippingCost({
          items: shippingItems,
          countryCode: address.countryCode,
          totalPrice: subtotalSum,
        })
      }

      const exchange = (val: number) => Number((val * exchangeRate).toFixed(2))
      const baseTotal = subtotalSum + baseShipping

      const order = await tx.order.create({
        data: {
          user: { connect: { id: userId } },
          deliveryType,
          currency,
          exchangeRate,
          exchangeLocale,
          baseSubtotal: subtotalSum,
          baseShipping,
          baseDiscount: totalBaseProductDiscount,
          baseTax: 0,
          baseTotal,
          subtotal: exchange(subtotalSum),
          shippingCost: exchange(baseShipping),
          discount: exchange(totalBaseProductDiscount),
          tax: 0,
          total: exchange(baseTotal),
          referrerCode: finalReferrerCode,
          items: { createMany: { data: orderItemsPayload } },

          ...(deliveryType === 'SHIPPING' && address
            ? {
                address: { connect: { id: addressId } },
                shippingName: address.name,
                shippingPhone: address.phone,
                shippingAddressText: formatFullAddress(address),
              }
            : {}),

          ...(deliveryType === 'PICKUP' && storefront
            ? {
                storefront: { connect: { id: storefrontId } },
                pickupDate: pickupDate ? new Date(pickupDate) : null,
                pickupStoreLocation: storefront.name,
              }
            : {}),
        },
      })

      if (validAffiliate) {
        const isHighValue =
          Number(baseTotal) >= Number(validAffiliate.thresholdAmount)
        const appliedRate = isHighValue
          ? validAffiliate.highValueRate
          : validAffiliate.baseRate
        const commissionAmount = (Number(baseTotal) * Number(appliedRate)) / 100

        await tx.affiliateCommission.create({
          data: {
            affiliateId: validAffiliate.id,
            orderId: order.id,
            orderAmount: baseTotal,
            appliedRate: appliedRate,
            commissionAmount: commissionAmount,
            status: PayoutStatus.PENDING,
          },
        })
      }

      await Promise.all([
        ...items.map((item) =>
          processStockMovement(tx, {
            ...item,
            type: StockMovementType.SALE,
            orderId: order.id,
            direction: 'decrement',
          }),
        ),
        tx.cart.deleteMany({ where: { userId } }),
      ])

      return ok(order.id)
    })
  })

const updateOrder = async (input: UpdateOrderInput) =>
  withAuth(async () => {
    return prisma.$transaction(async (tx) => {
      const { orderId, status } = input

      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (!order) {
        return fail(ERROR_CODES.DATA_NOT_FOUND)
      }

      if (
        order.status !== status &&
        !canTransitionOrderStatus(order.status, status)
      ) {
        return fail(ERROR_CODES.BAD_REQUEST)
      }

      if (
        CANCEL_OR_REFUND_STATUSES.has(status) &&
        !CANCEL_OR_REFUND_STATUSES.has(order.status)
      ) {
        await Promise.all(
          order.items.map((item) => {
            return processStockMovement(tx, {
              productId: item.productId!,
              variantId: item.variantId,
              quantity: item.quantity,
              type: StockMovementType.RESTOCK,
              orderId: order.id,
              direction: 'increment',
            })
          }),
        )
      }

      if (CANCEL_OR_REFUND_STATUSES.has(status)) {
        await tx.affiliateCommission.updateMany({
          where: {
            orderId: orderId,
            status: PayoutStatus.PENDING,
          },
          data: { status: PayoutStatus.REJECTED },
        })
      }

      if (status === OrderStatus.DELIVERED) {
        await tx.affiliateCommission.updateMany({
          where: {
            orderId: orderId,
            status: PayoutStatus.PENDING,
          },
          data: { status: PayoutStatus.COMPLETED },
        })
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          ...buildStatusUpdateData(status, input),
        },
      })

      revalidatePath('/dashboard/orders')
      return ok()
    })
  })

export {
  getAffiliateOrders,
  getAffiliateStats,
  sendOrderEmail,
  getOrders,
  getOrderById,
  getOrderStats,
  getRevenueStats,
  createOrder,
  updateOrder,
}

export type { GetOrdersOptions, UpdateOrderInput, CreateOrderInput }
