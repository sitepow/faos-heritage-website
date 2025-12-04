'use server'

import { getPrismaError, prisma } from '@/utils/prisma'
import { revalidatePath } from 'next/cache'

export type GetCartsResult = Awaited<ReturnType<typeof getCarts>>

const getCarts = async (userId: string) => {
  try {
    return await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stockQuantity: true,
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
  }
}

const createCart = async (userId: string, productId: string, qty: number = 1) => {
  try {
    const existing = await prisma.cartItem.findFirst({
      where: { userId, productId },
    })

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + qty },
      })

      revalidatePath('/cart')

      return updated
    }

    const created = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity: qty,
      },
    })

    revalidatePath('/cart')

    return created
  } catch (error) {
    getPrismaError(error)
  }
}

const updateCart = async (cartId: string, quantity: number) => {
  try {
    if (quantity <= 0) {
      return await deleteCart(cartId)
    }

    const updated = await prisma.cartItem.update({
      where: { id: cartId },
      data: { quantity },
    })

    revalidatePath('/cart')

    return updated
  } catch (error) {
    getPrismaError(error)
  }
}

const deleteCart = async (cartId: string) => {
  try {
    const deleted = await prisma.cartItem.delete({
      where: { id: cartId },
    })

    revalidatePath('/cart')

    return deleted
  } catch (error) {
    getPrismaError(error)
  }
}

const clearCart = async (userId: string) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId },
    })

    revalidatePath('/cart')

    return true
  } catch (error) {
    getPrismaError(error)
  }
}

const getDashboard = async (userId: string) => {
  try {
    const totalCarts = await prisma.cartItem.count({
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

export { clearCart, createCart, deleteCart, getCarts, getDashboard, updateCart }
