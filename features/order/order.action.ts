'use server'

import { OrderStatus, PaymentStatus, StockMovementType } from '@prisma/client'

import type { Prisma, Currency } from '@prisma/client'

import { calculateShippingCost } from '../shipping/shipping.action'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import {
  canTransitionOrderStatus,
  formatFullAddress,
  formatStat,
} from '@/utils/app'
import { decimalToNumber } from '@/utils/number'

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

interface CreateOrderItemInput {
  productId: string
  variantId?: string | null
  quantity: number
}

interface CreateOrderInput {
  items: CreateOrderItemInput[]
  addressId: string
  userId: string
  currency: Currency
  exchangeRate: number
  exchangeRateSource?: string
  exchangeLocale: string
}

type FetchOrdersResult = Awaited<ReturnType<typeof fetchOrders>>
type OrderItemDetail = FetchOrdersResult['items'][number]

type TransactionClient = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

const CANCEL_OR_REFUND_STATUSES = new Set<OrderStatus>([
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
])

const fetchOrders = async ({
  page = 1,
  limit = 10,
  userId,
}: GetOrdersOptions = {}) => {
  const skip = (page - 1) * limit
  const where: Prisma.OrderWhereInput = userId ? { userId } : {}

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        trackingWebsite: true,
        trackingNumber: true,
        createdAt: true,
        deliveredAt: true,
        shippedAt: true,
        paidAt: true,
        total: true,
        currency: true,
        exchangeLocale: true,
        exchangeRateSource: true,
        user: { select: { name: true } },
        address: { select: { countryCode: true } },
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                images: { select: { url: true } },
              },
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

const fetchOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: {
              unit: true,
              images: { select: { url: true } },
            },
          },
        },
      },
    },
  })

  return decimalToNumber(order)
}

const fetchDashboardStats = async () => {
  const [totalOrders, pending, delivered] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
  ])

  return [
    formatStat({ name: 'คำสั่งซื้อทั้งหมด', value: totalOrders }),
    formatStat({ name: 'คำสั่งซื้อที่รอชำระเงิน', value: pending }),
    formatStat({ name: 'คำสั่งซื้อที่สำเร็จแล้ว', value: delivered }),
  ]
}

const fetchRevenueStats = async () => {
  const [delivered, pending, cancelled] = await Promise.all([
    prisma.order.aggregate({
      where: { status: OrderStatus.DELIVERED },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { status: OrderStatus.PENDING },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { status: OrderStatus.CANCELLED },
      _sum: { total: true },
    }),
  ])

  return [
    formatStat({
      name: 'ยอดคำสั่งซื้อที่จัดส่งสำเร็จแล้ว',
      value: delivered._sum.total,
      isCurrency: true,
    }),
    formatStat({
      name: 'ยอดคำสั่งซื้อที่ถูกยกเลิก',
      value: cancelled._sum.total,
      isCurrency: true,
    }),
    formatStat({
      name: 'ยอดคำสั่งซื้อที่กำลังรอชำระเงิน',
      value: pending._sum.total,
      isCurrency: true,
    }),
  ]
}

const createOrder = async (input: CreateOrderInput) => {
  const {
    items,
    addressId,
    userId,
    currency,
    exchangeRate,
    exchangeLocale,
    exchangeRateSource,
  } = input

  return prisma.$transaction(async (tx) => {
    const address = await tx.address.findUnique({
      where: { id: addressId },
    })

    if (!address) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    if (items.length === 0) {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }

    const products = await tx.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
      include: { variants: true },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    const orderItemsPayload: Prisma.OrderItemCreateManyOrderInput[] = []
    const shippingItems: { quantity: number; weight: number }[] = []

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return fail(ERROR_CODES.DATA_NOT_FOUND)
      }

      const variant = item.variantId
        ? product.variants.find((v) => v.id === item.variantId)
        : null

      const stock = variant ? variant.stockQuantity : product.stockQuantity

      if (stock < item.quantity) {
        return fail(ERROR_CODES.SYSTEM_ERROR)
      }

      const priceUsd = variant ? variant.price : product.price
      const weight = variant?.weight ?? product.weight ?? 0

      const priceLocal = Number(
        (decimalToNumber(priceUsd) * exchangeRate).toFixed(2),
      )

      orderItemsPayload.push({
        productId: product.id,
        variantId: item.variantId ?? null,
        currency,
        productName: product.name,
        variantName: variant?.name,
        quantity: item.quantity,
        price: priceLocal,
        subtotal: priceLocal * item.quantity,
        priceUsd,
        subtotalUsd: Number(priceUsd) * item.quantity,
      })

      shippingItems.push({
        quantity: item.quantity,
        weight: decimalToNumber(weight),
      })
    }

    const subtotalUsd = orderItemsPayload.reduce(
      (sum, item) => sum + Number(item.subtotalUsd),
      0,
    )

    const shippingUsd = await calculateShippingCost({
      items: shippingItems,
      countryCode: address.countryCode,
    })

    const subtotal = subtotalUsd * exchangeRate
    const shippingCost = shippingUsd * exchangeRate
    const totalUsd = subtotalUsd + shippingUsd
    const total = subtotal + shippingCost

    const order = await tx.order.create({
      data: {
        userId,
        currency,
        shippingCurrency: currency,
        exchangeRate,
        exchangeRateSource,
        subtotalUsd,
        shippingUsd,
        discountUsd: 0,
        taxUsd: 0,
        totalUsd,
        subtotal,
        shippingCost,
        discount: 0,
        tax: 0,
        total,
        exchangeLocale: exchangeLocale ?? '',
        shippingAddressId: addressId,
        shippingName: address.name,
        shippingPhone: address.phone,
        shippingAddressText: formatFullAddress(address),
        items: { createMany: { data: orderItemsPayload } },
      },
    })

    for (const item of orderItemsPayload) {
      if (item.productId) {
        await processStockMovement(tx, {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          type: StockMovementType.RESTOCK,
          orderId: order.id,
          direction: 'increment',
        })
      }
    }

    await tx.cart.deleteMany({ where: { userId } })

    return ok()
  })
}

const updateOrder = async (input: UpdateOrderInput) => {
  const { orderId, status, trackingWebsite, trackingNumber, reason } = input

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    if (!canTransitionOrderStatus(order.status, status)) {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }

    const shouldRestock =
      CANCEL_OR_REFUND_STATUSES.has(status) &&
      !CANCEL_OR_REFUND_STATUSES.has(order.status)

    if (shouldRestock) {
      for (const item of order.items) {
        await processStockMovement(tx, {
          productId: item.productId!,
          variantId: item.variantId,
          quantity: item.quantity,
          type: StockMovementType.RESTOCK,
          orderId: order.id,
          direction: 'increment',
        })
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        status,
        ...buildStatusUpdateData(status, {
          trackingWebsite,
          trackingNumber,
          reason,
        }),
      },
    })

    return ok()
  })
}

interface StockMovementParams {
  productId: string
  variantId?: string | null
  quantity: number
  type: StockMovementType
  orderId: string
  direction: 'increment' | 'decrement'
}

const processStockMovement = async (
  tx: TransactionClient,
  {
    productId,
    variantId,
    quantity,
    type,
    orderId,
    direction,
  }: StockMovementParams,
) => {
  const operation =
    direction === 'increment'
      ? { increment: quantity }
      : { decrement: quantity }

  if (variantId) {
    const updated = await tx.productVariant.updateMany({
      where: {
        id: variantId,
        ...(direction === 'decrement' && {
          stockQuantity: { gte: quantity },
        }),
      },
      data: { stockQuantity: operation },
    })

    if (updated.count === 0 && direction === 'decrement') {
      throw new Error(ERROR_CODES.SYSTEM_ERROR)
    }

    await tx.stockHistory.create({
      data: {
        variantId,
        quantity: direction === 'decrement' ? -quantity : quantity,
        type,
        reference: orderId,
      },
    })
  } else {
    const updated = await tx.product.updateMany({
      where: {
        id: productId,
        ...(direction === 'decrement' && {
          stockQuantity: { gte: quantity },
        }),
      },
      data: { stockQuantity: operation },
    })

    if (updated.count === 0 && direction === 'decrement') {
      throw new Error(ERROR_CODES.SYSTEM_ERROR)
    }

    await tx.stockHistory.create({
      data: {
        productId,
        quantity: direction === 'decrement' ? -quantity : quantity,
        type,
        reference: orderId,
      },
    })
  }
}

const buildStatusUpdateData = (
  status: OrderStatus,
  meta: {
    trackingWebsite?: string
    trackingNumber?: string
    reason?: string
  },
): Prisma.OrderUpdateInput => {
  const now = new Date()

  switch (status) {
    case OrderStatus.PAID:
      return { paymentStatus: PaymentStatus.PAID, paidAt: now }

    case OrderStatus.PROCESSING:
      return { shippedAt: now }

    case OrderStatus.DELIVERED:
      return {
        deliveredAt: now,
        trackingWebsite: meta.trackingWebsite,
        trackingNumber: meta.trackingNumber,
      }

    case OrderStatus.CANCELLED:
      return {
        cancelledAt: now,
        paymentStatus: PaymentStatus.FAILED,
        cancelReason: meta.reason,
      }

    case OrderStatus.REFUNDED:
      return {
        refundedAt: now,
        paymentStatus: PaymentStatus.REFUNDED,
        cancelReason: meta.reason,
      }

    default:
      return {}
  }
}

export {
  fetchOrders,
  fetchOrderById,
  fetchDashboardStats,
  fetchRevenueStats,
  createOrder,
  updateOrder,
}

export type {
  FetchOrdersResult,
  OrderItemDetail,
  GetOrdersOptions,
  UpdateOrderInput,
  CreateOrderInput,
}
