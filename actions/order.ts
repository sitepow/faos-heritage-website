'use server'

import type { Order, OrderStatus, Prisma } from '@prisma/client'

import { getFullAddress } from '@/utils/helper'
import { prisma, getPrismaError } from '@/utils/prisma'

interface UpdateOrderInput {
  orderId: string
  status: OrderStatus
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

export type GetOrdersResult = Awaited<ReturnType<typeof getOrders>>
export type GetOrderResult = GetOrdersResult['items'][number]

type SortOrder = 'asc' | 'desc'

interface SortByItem {
  readonly field: keyof Order
  readonly order: SortOrder
}

interface getOrdersProps {
  cursor?: string | null
  limit?: number
  userId: string
  sortBy?: SortByItem
}

const getOrders = async ({
  cursor,
  limit = 8,
  userId,
  sortBy = { field: 'createdAt', order: 'desc' },
}: getOrdersProps) => {
  try {
    const items = await prisma.order.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      where: {
        userId,
      },
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        status: true,
        createdAt: true,
        total: true,
        user: {
          select: {
            name: true,
          },
        },
        items: {
          select: {
            quantity: true,
            product: {
              select: {
                name: true,
                images: {
                  select: { url: true },
                },
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy.field]: sortBy.order,
      },
    })

    const hasNextPage = items.length > limit
    const resultItems = hasNextPage ? items.slice(0, limit) : items
    let nextCursor: string | null = null

    if (hasNextPage) {
      nextCursor = resultItems[resultItems.length - 1].id
    }

    return {
      items: resultItems,
      nextCursor,
    }
  } catch (error) {
    getPrismaError(error)

    return { items: [], nextCursor: null, totalCount: cursor ? undefined : 0 }
  }
}

const createOrder = async (data: CreateOrderInput) => {
  try {
    const { items, addressId, userId } = data

    return await prisma.$transaction(async (tx) => {
      const address = await tx.address.findUnique({
        where: { id: addressId },
      })

      if (!address) throw new Error('ไม่พบที่อยู่จัดส่ง')

      const productIds = items.map((i) => i.productId)

      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        include: { variants: true },
      })

      const productMap = new Map(products.map((p) => [p.id, p]))

      const productItems = items.map((item) => {
        const product = productMap.get(item.productId)

        if (!product) throw new Error('ไม่พบสินค้า')

        const variant = product.variants.find((v) => v.id === item.variantId)

        if (product.variants.length > 0 && !variant) {
          throw new Error(`สินค้านี้ต้องเลือกตัวเลือกสินค้า (variant)`)
        }

        if (variant) {
          if (variant.stockQuantity < item.quantity) {
            throw new Error(`สินค้า ${variant.sku || variant.name} สต็อกไม่พอ`)
          }
        } else {
          if (product.stockQuantity < item.quantity) {
            throw new Error(`สินค้า ${product.name} สต็อกไม่พอ`)
          }
        }

        const price = variant ? variant.price : product.price
        const subtotal = price * item.quantity

        return {
          ...item,
          productName: product.name,
          sku: variant?.sku ?? product.sku,
          price,
          subtotal,
          isVariant: !!variant,
        }
      })

      const subtotal = productItems.reduce((sum, p) => sum + p.subtotal, 0)
      const shippingCost = 0
      const discount = 0
      const tax = 0
      const total = subtotal - discount + shippingCost + tax

      const order = await tx.order.create({
        data: {
          userId,
          subtotal,
          discount,
          tax,
          shippingCost,
          total,
          shippingAddressId: addressId,
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingAddressText: getFullAddress(address),
          items: {
            createMany: {
              data: productItems.map((i) => ({
                productId: i.productId,
                productName: i.productName,
                sku: i.sku,
                quantity: i.quantity,
                price: i.price,
                subtotal: i.subtotal,
              })),
            },
          },
        } as Prisma.OrderUncheckedCreateInput,
      })

      for (const item of productItems) {
        if (item.isVariant) {
          const updated = await tx.productVariant.updateMany({
            where: {
              id: item.variantId!,
              stockQuantity: { gte: item.quantity },
            },
            data: {
              stockQuantity: { decrement: item.quantity },
            },
          })

          if (updated.count === 0) {
            throw new Error(`สินค้า ${item.sku} ถูกขายไปก่อนหน้า สต็อกไม่พอ`)
          }

          await tx.stockHistory.create({
            data: {
              variantId: item.variantId!,
              quantity: -item.quantity,
              type: 'SALE',
              reference: order.id,
            },
          })
        } else {
          const updated = await tx.product.updateMany({
            where: {
              id: item.productId,
              stockQuantity: { gte: item.quantity },
            },
            data: {
              stockQuantity: { decrement: item.quantity },
            },
          })

          if (updated.count === 0) {
            throw new Error(
              `สินค้า ${item.productName} ถูกขายไปก่อนหน้า สต็อกไม่พอ`,
            )
          }

          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              quantity: -item.quantity,
              type: 'SALE',
              reference: order.id,
            },
          })
        }
      }

      await tx.cart.deleteMany({
        where: { userId },
      })

      return order
    })
  } catch (error) {
    return getPrismaError(error)
  }
}

const updateOrder = async (data: UpdateOrderInput) => {
  try {
    const { orderId, status } = data

    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })

      if (!order) throw new Error('ไม่พบออเดอร์')

      if (
        (status === 'CANCELLED' || status === 'REFUNDED') &&
        order.status === 'DELIVERED'
      ) {
        throw new Error('ออเดอร์นี้ถูกจัดส่งแล้ว ไม่สามารถยกเลิกได้')
      }

      const shouldRestock =
        (status === 'CANCELLED' || status === 'REFUNDED') &&
        !(order.status === 'CANCELLED' || order.status === 'REFUNDED')

      if (shouldRestock) {
        for (const item of order.items) {
          if (item.sku) {
            const variant = await tx.productVariant.findFirst({
              where: { sku: item.sku },
            })

            if (variant) {
              await tx.productVariant.update({
                where: { id: variant.id },
                data: { stockQuantity: { increment: item.quantity } },
              })

              await tx.stockHistory.create({
                data: {
                  variantId: variant.id,
                  quantity: item.quantity,
                  type: 'RESTOCK',
                  reference: order.id,
                },
              })
            } else {
              const simple = await tx.product.findFirst({
                where: { sku: item.sku },
              })

              if (simple) {
                await tx.product.update({
                  where: { id: simple.id },
                  data: { stockQuantity: { increment: item.quantity } },
                })

                await tx.stockHistory.create({
                  data: {
                    productId: simple.id,
                    quantity: item.quantity,
                    type: 'RESTOCK',
                    reference: order.id,
                  },
                })
              }
            }
          }
        }
      }

      return await tx.order.update({
        where: { id: orderId },
        data: { status },
      })
    })
  } catch (error) {
    return getPrismaError(error)
  }
}

export { createOrder, updateOrder, getOrders }
