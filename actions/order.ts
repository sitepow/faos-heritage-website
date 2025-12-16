'use server'

import { OrderStatus, PaymentStatus, StockMovementType } from '@prisma/client'

import type { Prisma } from '@prisma/client'

import { checkOrderStatus, getFullAddress } from '@/utils/helper'
import { prisma, getPrismaError } from '@/utils/prisma'

interface UpdateOrderInput {
  orderId: string
  status: OrderStatus
  reason?: string
  trackingWebsite?: string
  trackingNumber?: string
}

interface CreateOrderInput {
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

const getOrder = async (orderId: string) => {
  try {
    if (!orderId) throw new Error('Please specify the order ID.')

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

    if (!order) throw new Error('No order found.')

    return order
  } catch (error) {
    return getPrismaError(error)
  }
}

const createOrder = async (data: CreateOrderInput) => {
  try {
    const { items, addressId, userId } = data

    return await prisma.$transaction(async (tx) => {
      const address = await tx.address.findUnique({
        where: { id: addressId },
      })

      if (!address) throw new Error('Shipping address not found.')
      if (!items || items.length === 0)
        throw new Error('No items were found in your order.')

      const products = await tx.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
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

      const productsMap = new Map(products.map((p) => [p.id, p]))

      const productItems = items.map((item) => {
        const product = productsMap.get(item.productId)

        if (!product) throw new Error('No products found.')

        const variant =
          product.variants.find((v) => v.id === item.variantId) ?? null

        if (product.variants.length > 0 && !variant) {
          throw new Error(
            `${product.name} This product requires selecting a product option.`,
          )
        }

        const stock = variant ? variant.stockQuantity : product.stockQuantity

        if (stock < item.quantity) {
          const name = variant ? variant.name : product.name

          throw new Error(`Product ${name} Insufficient stock.`)
        }

        const price = variant ? variant.price : product.price

        return {
          ...item,
          productName: product.name,
          price,
          subtotal: price * item.quantity,
        }
      })

      const subtotal = productItems.reduce((sum, p) => sum + p.subtotal, 0)

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
              id: item.variantId!,
              stockQuantity: { gte: item.quantity },
            },
            data: { stockQuantity: { decrement: item.quantity } },
          })

          if (updated.count === 0)
            throw new Error(`Product ${item.productName} Sold previously.`)

          await tx.stockHistory.create({
            data: {
              variantId: item.variantId!,
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

          if (updated.count === 0)
            throw new Error(`Product ${item.productName} Sold previously.`)

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

      return order
    })
  } catch (error) {
    return getPrismaError(error)
  }
}

const updateOrder = async (data: UpdateOrderInput) => {
  try {
    const { orderId, status, trackingWebsite, trackingNumber, reason } = data

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (!order) throw new Error('No order found.')

      const prevStatus = order.status

      if (!checkOrderStatus(prevStatus, status)) {
        throw new Error('This order status cannot be changed.')
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

      return await tx.order.update({
        where: { id: orderId },
        data: { status, ...statusMap[status] },
      })
    })
  } catch (error) {
    return getPrismaError(error)
  }
}

export type { UpdateOrderInput, CreateOrderInput }
export { createOrder, updateOrder, getOrder }
