'use server'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { decimalToNumber } from '@/utils/number'

export type GetCartsResult = Awaited<ReturnType<typeof getCarts>>
export type GetCartResult = GetCartsResult[number]

type createCartParams = {
  userId: string
  productId: string
  variantId?: string
}

type updateCartParams = {
  cartId: string
  quantity: number
  variantId?: string
}

export const getCarts = async (userId: string) => {
  return decimalToNumber(
    await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            unit: true,
            weight: true,
            stockQuantity: true,
            variants: {
              select: {
                id: true,
                name: true,
                price: true,
                stockQuantity: true,
                weight: true,
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
    }),
  )
}

export const createCart = async ({
  userId,
  productId,
  variantId,
}: createCartParams) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: variantId ? { where: { id: variantId } } : false,
      },
    })

    if (!product) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    let availableStock = 0

    if (variantId) {
      const variant = product.variants.find(
        (variant) => variant.id === variantId,
      )

      if (!variant) {
        return fail(ERROR_CODES.DATA_NOT_FOUND)
      }

      availableStock = variant.stockQuantity
    } else {
      availableStock = product.stockQuantity
    }

    if (availableStock < 1) {
      return fail(ERROR_CODES.DATA_INSUFFICIENT)
    }

    const existing = await prisma.cart.findFirst({
      where: { userId, productId },
    })

    if (existing) {
      const isDifferentVariant = existing.variantId !== (variantId || null)

      if (isDifferentVariant) {
        return await prisma.$transaction(async (tx) => {
          await tx.cart.delete({
            where: { id: existing.id },
          })

          return await tx.cart.create({
            data: {
              userId,
              productId,
              variantId: variantId || null,
              quantity: 1,
            },
          })
        })
      } else {
        const newQty = existing.quantity + 1

        if (newQty > availableStock) {
          return fail(ERROR_CODES.DATA_INSUFFICIENT)
        }

        return await prisma.cart.update({
          where: { id: existing.id },
          data: { quantity: newQty },
        })
      }
    }

    await prisma.cart.create({
      data: {
        userId,
        productId,
        variantId: variantId || null,
        quantity: 1,
      },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const updateCart = async ({
  cartId,
  quantity,
  variantId,
}: updateCartParams) => {
  try {
    if (quantity <= 0) {
      return await deleteCart(cartId)
    }

    const currentCartItem = await prisma.cart.findUnique({
      where: { id: cartId },
      select: { productId: true, variantId: true },
    })

    if (!currentCartItem) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    const targetVariantId =
      variantId !== undefined ? variantId : currentCartItem.variantId

    const product = await prisma.product.findUnique({
      where: { id: currentCartItem.productId },
      include: {
        variants: targetVariantId ? { where: { id: targetVariantId } } : false,
      },
    })

    if (!product) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    let availableStock = 0

    if (targetVariantId) {
      const variant = product.variants.find(
        (variant) => variant.id === targetVariantId,
      )

      if (!variant) {
        return fail(ERROR_CODES.DATA_NOT_FOUND)
      }

      availableStock = variant.stockQuantity
    } else {
      availableStock = product.stockQuantity
    }

    if (quantity > availableStock) {
      return fail(ERROR_CODES.DATA_INSUFFICIENT)
    }

    await prisma.cart.update({
      where: { id: cartId },
      data: {
        quantity,
        variantId: targetVariantId || null,
      },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const deleteCart = async (cartId: string) => {
  try {
    await prisma.cart.delete({
      where: { id: cartId },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const clearCart = async (userId: string) => {
  try {
    await prisma.cart.deleteMany({
      where: { userId },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const getCartStat = async (userId: string) => {
  const totalCarts = await prisma.cart.count({
    where: {
      userId,
    },
  })

  return {
    totalCarts,
  }
}
