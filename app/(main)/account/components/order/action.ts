'use server'

import { OrderStatus, PaymentStatus, StockMovementType } from '@prisma/client'

import type { Prisma } from '@prisma/client'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { getFullAddress } from '@/utils/features/account/helpers'
import { checkOrderStatus } from '@/utils/features/order/helpers'

export interface UpdateOrderInput {
  orderId: string
  status: OrderStatus
  reason?: string
  trackingWebsite?: string
  trackingNumber?: string
}

export interface CreateOrderInput {
  items: {
    productId: string
    variantId?: string | null
    quantity: number
  }[]
  addressId: string
  userId: string
}

const CANCEL_OR_REFUND: OrderStatus[] = [
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
]

export const getOrder = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      shippingAddressText: true,
      trackingNumber: true,
      trackingWebsite: true,
      cancelReason: true,
      createdAt: true,
      paidAt: true,
      shippedAt: true,
      deliveredAt: true,
      total: true,
      subtotal: true,
      items: {
        select: {
          id: true,
          productId: true,
          variantId: true,
          productName: true,
          price: true,
          quantity: true,
          product: {
            select: {
              images: {
                select: {
                  url: true,
                },
              },
              unit: true,
            },
          },
        },
      },
    },
  })

  if (!order) {
    return
  }

  return order
}

export const createOrder = async (data: CreateOrderInput) => {
  const { items, addressId, userId } = data

  return await prisma.$transaction(async (tx) => {
    const address = await tx.address.findUnique({
      where: { id: addressId },
    })

    if (!address) {
      return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
    }

    if (!items || items.length === 0) {
      return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
    }

    const products = await tx.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            stockQuantity: true,
          },
        },
      },
    })

    const productsMap = new Map(
      products.map((product) => [product.id, product]),
    )

    const productItems: {
      productId: string
      variantId?: string | null
      quantity: number
      productName: string
      price: number
      subtotal: number
    }[] = []

    for (const item of items) {
      const product = productsMap.get(item.productId)
      if (!product) return fail(ERROR_CODES.DATA_NOT_FOUND)

      const variant =
        product.variants.find((variant) => variant.id === item.variantId) ??
        null

      if (product.variants.length > 0 && !variant) {
        return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
      }

      const currentStock = variant
        ? variant.stockQuantity
        : product.stockQuantity
      if (currentStock < item.quantity)
        return fail(ERROR_CODES.DATA_INSUFFICIENT)

      const currentPrice = variant
        ? variant?.price?.toNumber()
        : product?.price?.toNumber()

      productItems.push({
        productId: item.productId,
        variantId: item.variantId ?? null,
        quantity: item.quantity,
        productName: product.name,
        price: currentPrice,
        subtotal: currentPrice * item.quantity,
      })
    }

    const subtotal = productItems.reduce(
      (sum, product) => sum + product.subtotal,
      0,
    )

    const order = await tx.order.create({
      data: {
        userId,
        subtotal,
        discount: 0,
        tax: 0,
        shippingCost: 0,
        total: subtotal,
        shippingAddressId: addressId,
        shippingName: address.name,
        shippingPhone: address.phone,
        shippingAddressText: getFullAddress(address),
        items: {
          createMany: { data: productItems },
        },
      } as Prisma.OrderUncheckedCreateInput,
    })

    for (const item of productItems) {
      if (item.variantId) {
        const updated = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            stockQuantity: { gte: item.quantity },
          },
          data: { stockQuantity: { decrement: item.quantity } },
        })

        if (updated.count === 0) {
          return fail(ERROR_CODES.DATA_ALREADY_EXISTS)
        }

        await tx.stockHistory.create({
          data: {
            variantId: item.variantId,
            quantity: -item.quantity,
            type: StockMovementType.SALE,
            reference: order.id,
          },
        })
      } else {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: { gte: item.quantity },
          },
          data: { stockQuantity: { decrement: item.quantity } },
        })

        if (updated.count === 0) {
          return fail(ERROR_CODES.DATA_ALREADY_EXISTS)
        }

        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            quantity: -item.quantity,
            type: StockMovementType.SALE,
            reference: order.id,
          },
        })
      }
    }

    await tx.cart.deleteMany({ where: { userId } })

    return done()
  })
}

export const updateOrder = async (data: UpdateOrderInput) => {
  const { orderId, status, trackingWebsite, trackingNumber, reason } = data

  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    const prevStatus = order.status

    if (!checkOrderStatus(prevStatus, status)) {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }

    const isCancelOrRefund = CANCEL_OR_REFUND.includes(status)
    const wasCancelOrRefund = CANCEL_OR_REFUND.includes(prevStatus)
    const shouldRestock = isCancelOrRefund && !wasCancelOrRefund

    if (shouldRestock) {
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { increment: item.quantity } },
          })

          await tx.stockHistory.create({
            data: {
              variantId: item.variantId,
              quantity: item.quantity,
              type: StockMovementType.RESTOCK,
              reference: order.id,
            },
          })
        } else {
          await tx.product.update({
            where: { id: item.productId! },
            data: { stockQuantity: { increment: item.quantity } },
          })

          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              quantity: item.quantity,
              type: StockMovementType.RESTOCK,
              reference: order.id,
            },
          })
        }
      }
    }

    const statusMap: Partial<Record<OrderStatus, Prisma.OrderUpdateInput>> = {
      [OrderStatus.PAID]: {
        paymentStatus: PaymentStatus.PAID,
        paidAt: new Date(),
      },

      [OrderStatus.PROCESSING]: {
        shippedAt: new Date(),
      },

      [OrderStatus.DELIVERED]: {
        deliveredAt: new Date(),
        trackingWebsite,
        trackingNumber,
      },

      [OrderStatus.CANCELLED]: {
        cancelledAt: new Date(),
        paymentStatus: PaymentStatus.FAILED,
        cancelReason: reason,
      },

      [OrderStatus.REFUNDED]: {
        refundedAt: new Date(),
        paymentStatus: PaymentStatus.REFUNDED,
        cancelReason: reason,
      },
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status, ...statusMap[status] },
    })

    return done()
  })
}
