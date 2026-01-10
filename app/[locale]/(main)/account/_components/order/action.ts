'use server'

import { OrderStatus, PaymentStatus, StockMovementType } from '@prisma/client'

import type { Currency, Prisma } from '@prisma/client'

import { calculateShippingCost } from '@/app/[locale]/(dashboard)/dashboard/product/action/shipping/cost'
import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { getFullAddress } from '@/utils/helpers/account'
import { decimalToNumber } from '@/utils/helpers/number'
import { checkOrderStatus } from '@/utils/helpers/order'

export interface UpdateOrderInput {
  orderId: string
  status: OrderStatus
  reason?: string
  trackingWebsite?: string
  trackingNumber?: string
}

type NestedOrderItemCreate = Omit<
  Prisma.OrderItemUncheckedCreateInput,
  'orderId'
>

export interface CreateOrderInput {
  items: {
    productId: string
    variantId?: string | null
    quantity: number
  }[]
  addressId: string
  userId: string
  currency: Currency
  exchangeRate: number
  exchangeRateSource?: string
  exchangeLocale: string
}

const CANCEL_OR_REFUND: OrderStatus[] = [
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
]

export const getOrder = async (orderId: string) => {
  return decimalToNumber(
    await prisma.order.findUnique({
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
        shippingCost: true,
        currency: true,
        exchangeLocale: true,
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
    }),
  )
}

export const createOrder = async (data: CreateOrderInput) => {
  const {
    items,
    addressId,
    userId,
    currency,
    exchangeRate,
    exchangeRateSource,
    exchangeLocale,
  } = data

  return await prisma.$transaction(async (tx) => {
    const address = await tx.address.findUnique({
      where: { id: addressId },
    })

    if (!address) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    if (!items || items.length === 0) {
      return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
    }

    const products = decimalToNumber(
      await tx.product.findMany({
        where: { id: { in: items.map((item) => item.productId) } },
        select: {
          id: true,
          name: true,
          price: true,
          weight: true,
          stockQuantity: true,
          variants: {
            select: {
              id: true,
              name: true,
              price: true,
              weight: true,
              stockQuantity: true,
            },
          },
        },
      }),
    )

    const productMap = new Map(products.map((product) => [product.id, product]))

    const orderItems: NestedOrderItemCreate[] = []
    const shippingItems: { quantity: number; weight: number }[] = []

    for (const item of items) {
      const product = productMap.get(item.productId)

      if (!product) {
        return fail(ERROR_CODES.DATA_NOT_FOUND)
      }

      const variant =
        product.variants.find((variant) => variant.id === item.variantId) ??
        null

      const stock = variant ? variant.stockQuantity : product.stockQuantity
      if (stock < item.quantity) {
        return fail(ERROR_CODES.DATA_INSUFFICIENT)
      }

      const priceUsd = variant ? variant.price : product.price
      const price = Number((priceUsd * exchangeRate).toFixed(2))

      orderItems.push({
        productId: product.id,
        variantId: item.variantId ?? null,
        currency,
        productName: product.name,
        variantName: variant?.name,
        quantity: item.quantity,
        price,
        subtotal: price * item.quantity,
        priceUsd,
        subtotalUsd: priceUsd * item.quantity,
      })

      shippingItems.push({
        quantity: item.quantity,
        weight: variant?.weight ?? product.weight ?? 0,
      })
    }

    const subtotalUsd = orderItems.reduce(
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
        shippingAddressText: getFullAddress(address),

        items: {
          createMany: { data: orderItems },
        },
      },
    })

    for (const item of orderItems) {
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
            id: item?.productId!,
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
