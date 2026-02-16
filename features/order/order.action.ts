'use server'

import { OrderStatus, StockMovementType } from '@prisma/client'

import type { Prisma, Currency } from '@prisma/client'

import { buildStatusUpdateData } from './order.helper'
import { calculateShippingCost } from '../shipping/shipping.action'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { getServerUser, withAuth } from '@/lib/session'
import {
  canTransitionOrderStatus,
  formatFullAddress,
  formatStat,
} from '@/utils'
import { decimalToNumber } from '@/utils/number'
import { getProductPriceInfo } from '@/utils/productPrice'

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
  addressId: string
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
        user: { select: { name: true } },
        address: { select: { countryCode: true } },
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
    formatStat({ name: 'คำสั่งซื้อทั้งหมด', value: total }),
    formatStat({ name: 'คำสั่งซื้อที่รอชำระเงิน', value: pending }),
    formatStat({ name: 'คำสั่งซื้อที่สำเร็จแล้ว', value: delivered }),
  ]
}

const getRevenueStats = async () => {
  const statuses = [
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
    OrderStatus.PENDING,
  ]
  const results = await Promise.all(
    statuses.map((s) =>
      prisma.order.aggregate({ where: { status: s }, _sum: { total: true } }),
    ),
  )

  const labels = ['จัดส่งสำเร็จ', 'ถูกยกเลิก', 'รอชำระเงิน']
  return results.map((res, i) =>
    formatStat({
      name: `ยอดรวม${labels[i]}`,
      value: res._sum.total || 0,
      isCurrency: true,
    }),
  )
}

const createOrder = async (input: CreateOrderInput) =>
  withAuth(async () => {
    const { userId } = await getServerUser()

    return prisma.$transaction(async (tx) => {
      const {
        items,
        addressId,
        currency,
        exchangeRate,
        exchangeLocale,
        referrerId,
      } = input

      const address = await tx.address.findUnique({ where: { id: addressId } })
      if (!address || items.length === 0) {
        return fail(ERROR_CODES.BAD_REQUEST)
      }

      const products = await tx.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
        include: { variants: true },
      })

      const productMap = new Map(products.map((p) => [p.id, p]))
      const orderItemsPayload: Prisma.OrderItemCreateManyOrderInput[] = []
      const shippingItems: { quantity: number; weight: number }[] = []
      let totalBaseProductDiscount = 0

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

        orderItemsPayload.push({
          productId: product.id,
          variantId: item.variantId,
          productName: product.name,
          variantName: variant?.name,
          quantity: item.quantity,
          basePrice: effectiveBasePrice,
          baseSubtotal: effectiveBasePrice * item.quantity,
          price: priceLocal,
          subtotal: priceLocal * item.quantity,
          currency,
        })

        shippingItems.push({
          quantity: item.quantity,
          weight: decimalToNumber(variant?.weight ?? product.weight ?? 0),
        })
      }

      const baseSubtotal = orderItemsPayload.reduce(
        (sum, item) => sum + Number(item.baseSubtotal),
        0,
      )
      const baseShipping = await calculateShippingCost({
        items: shippingItems,
        countryCode: address.countryCode,
      })

      const exchange = (val: number) => Number((val * exchangeRate).toFixed(2))
      const baseTotal = baseSubtotal + baseShipping

      const order = await tx.order.create({
        data: {
          user: { connect: { id: userId } },
          currency,
          exchangeRate,
          exchangeLocale,
          baseSubtotal,
          baseShipping,
          baseDiscount: totalBaseProductDiscount,
          baseTax: 0,
          baseTotal,
          subtotal: exchange(baseSubtotal),
          shippingCost: exchange(baseShipping),
          discount: exchange(totalBaseProductDiscount),
          tax: 0,
          total: exchange(baseTotal),
          address: { connect: { id: addressId } },
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingAddressText: formatFullAddress(address),
          items: { createMany: { data: orderItemsPayload } },
          referrerCode: referrerId || null,
        },
      })

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

      if (!canTransitionOrderStatus(order.status, status)) {
        return fail(ERROR_CODES.BAD_REQUEST)
      }

      if (
        CANCEL_OR_REFUND_STATUSES.has(status) &&
        !CANCEL_OR_REFUND_STATUSES.has(order.status)
      ) {
        await Promise.all(
          order.items.map((item) =>
            processStockMovement(tx, {
              productId: item.productId!,
              variantId: item.variantId,
              quantity: item.quantity,
              type: StockMovementType.RESTOCK,
              orderId: order.id,
              direction: 'increment',
            }),
          ),
        )
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          status,
          ...buildStatusUpdateData(status, input),
        },
      })

      return ok()
    })
  })

export {
  getOrders,
  getOrderById,
  getOrderStats,
  getRevenueStats,
  createOrder,
  updateOrder,
}

export type { GetOrdersOptions, UpdateOrderInput, CreateOrderInput }
