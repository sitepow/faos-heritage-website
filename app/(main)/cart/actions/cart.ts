'use server'

import { getPrismaError, prisma } from '@/utils/prisma'

export type GetCartsResult = Awaited<ReturnType<typeof getCarts>>

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
      select: { stockQuantity: true },
    })

    if (!product) throw new Error('ไม่พบสินค้าที่ต้องการ')

    const existing = await prisma.cart.findFirst({
      where: { userId, productId },
    })

    if (existing) {
      const newQty = existing.quantity + 1

      if (newQty > product.stockQuantity) {
        throw new Error(
          'คุณไม่สามารถเพิ่มสินค้าได้ เนื่องจากจำนวนที่ต้องการเกินจำนวนสต็อกที่มีอยู่ในคลังสินค้า',
        )
      }

      await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: newQty, variantId: variantId ?? null },
      })

      throw new Error(
        'คุณได้เพิ่มสินค้านี้เข้าในตระกร้าไว้แล้ว โปรดเลือกสินค้าชิ้นใหม่ที่ต้องการ',
      )
    }

    if (product.stockQuantity < 1) {
      throw new Error(
        'ไม่สามารถเพิ่มสินค้าได้ เนื่องจากจำนวนสต็อกของสินค้ารายการนี้หมดหรือมีไม่เพียงพอต่อการทำรายการ',
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

export { clearCart, createCart, deleteCart, getCarts, getDashboard, updateCart }
