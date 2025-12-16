'use server'

import { getPrismaError, prisma } from '@/utils/prisma'

type GetCartsResult = Awaited<ReturnType<typeof getCarts>>
type GetCartResult = GetCartsResult[number]

const getCarts = async (userId: string) => {
  try {
    return await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            unit: true,
            stockQuantity: true,
            variants: {
              select: {
                id: true,
                name: true,
                price: true,
                stockQuantity: true,
              },
            },
            images: {
              select: {
                url: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    getPrismaError(error)

    return []
  }
}

const createCart = async ({
  userId,
  productId,
  variantId,
}: {
  userId: string
  productId: string
  variantId?: string
}) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        stockQuantity: true,
        variants: {
          select: {
            stockQuantity: true,
          },
        },
      },
    })

    if (!product) throw new Error('The requested product was not found.')

    const existing = await prisma.cart.findFirst({
      where: { userId, productId },
    })

    if (existing) {
      const newQty = existing.quantity + 1

      if (newQty > product.stockQuantity) {
        throw new Error(
          'You cannot add the product because the requested quantity exceeds the available stock in the warehouse.',
        )
      }

      return await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: newQty, variantId: variantId ?? null },
      })
    }

    if (product.stockQuantity < 1) {
      throw new Error(
        'The item cannot be added because the stock quantity for this item is out of stock or there is insufficient stock to process the order.',
      )
    }

    return await prisma.cart.create({
      data: {
        userId,
        productId,
        variantId,
        quantity: 1,
      },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const updateCart = async ({
  cartId,
  quantity,
  variantId,
}: {
  cartId: string
  quantity: number
  variantId?: string
}) => {
  try {
    if (quantity <= 0) {
      return await deleteCart(cartId)
    }

    await prisma.cart.update({
      where: { id: cartId },
      data: {
        quantity,
        variantId: variantId ?? null,
      },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const deleteCart = async (cartId: string) => {
  try {
    await prisma.cart.delete({
      where: { id: cartId },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const clearCart = async (userId: string) => {
  try {
    await prisma.cart.deleteMany({
      where: { userId },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getDashboard = async (userId: string) => {
  try {
    const totalCarts = await prisma.cart.count({
      where: {
        userId,
      },
    })

    return {
      totalCarts,
    }
  } catch (error) {
    getPrismaError(error)
  }
}

export type { GetCartsResult, GetCartResult }
export { clearCart, createCart, deleteCart, getCarts, getDashboard, updateCart }
