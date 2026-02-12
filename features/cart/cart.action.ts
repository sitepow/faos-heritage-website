'use server'

import { Role } from '@prisma/client'

import { transformProduct } from '../product/product.helper'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'
import { decimalToNumber } from '@/utils'

type CreateCartParams = {
  productId: string
  variantId?: string | null
  quantity: number
}

type UpdateCartParams = {
  cartId: string
  quantity: number
  variantId?: string
}

type GetCartsResult = Awaited<ReturnType<typeof getCarts>>
type CartItem = GetCartsResult[number]

const getAvailableStock = async (
  productId: string,
  variantId?: string | null,
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      variants: variantId ? { where: { id: variantId } } : false,
    },
  })

  if (!product) {
    return null
  }

  const stock = variantId
    ? product.variants.find((v) => v.id === variantId)?.stockQuantity
    : product.stockQuantity

  return stock ?? null
}

const createCart = async (params: CreateCartParams) =>
  withRole([Role.ADMIN, Role.CUSTOMER], async (userId) => {
    const { productId, variantId, quantity } = params
    if (quantity < 1) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      const stock = await getAvailableStock(productId, variantId)

      if (stock === null) {
        return fail(ERROR_CODES.DATA_NOT_FOUND)
      }

      if (stock < quantity) {
        return fail(ERROR_CODES.PRODUCT_OUT_OF_STOCK)
      }

      const existing = await prisma.cart.findFirst({
        where: { userId, productId },
      })

      if (existing) {
        const isSameVariant = existing.variantId === (variantId || null)

        if (isSameVariant) {
          const newQty = existing.quantity + quantity
          if (newQty > stock) {
            return fail(ERROR_CODES.PRODUCT_OUT_OF_STOCK)
          }

          await prisma.cart.update({
            where: { id: existing.id },
            data: { quantity: newQty },
          })
        } else {
          await prisma.$transaction([
            prisma.cart.delete({ where: { id: existing.id } }),
            prisma.cart.create({
              data: {
                userId,
                productId,
                variantId: variantId || null,
                quantity,
              },
            }),
          ])
        }
      } else {
        await prisma.cart.create({
          data: { userId, productId, variantId: variantId || null, quantity },
        })
      }

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateCart = async ({ cartId, quantity, variantId }: UpdateCartParams) =>
  withRole([Role.ADMIN, Role.CUSTOMER], async (userId) => {
    if (quantity <= 0) {
      return deleteCart(cartId)
    }

    try {
      const current = await prisma.cart.findUnique({
        where: { id: cartId, userId },
        select: { productId: true, variantId: true },
      })

      if (!current) {
        return fail(ERROR_CODES.DATA_NOT_FOUND)
      }

      const targetVariantId =
        variantId !== undefined ? variantId : current.variantId
      const stock = await getAvailableStock(current.productId, targetVariantId)

      if (stock === null) {
        return fail(ERROR_CODES.DATA_NOT_FOUND)
      }

      if (quantity > stock) {
        return fail(ERROR_CODES.PRODUCT_OUT_OF_STOCK)
      }

      await prisma.cart.update({
        where: { id: cartId },
        data: {
          quantity,
          variantId: targetVariantId || null,
        },
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteCart = async (cartId: string) =>
  withRole([Role.ADMIN, Role.CUSTOMER], async (userId) => {
    try {
      await prisma.cart.delete({ where: { id: cartId, userId } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const clearCart = async () =>
  withRole([Role.ADMIN, Role.CUSTOMER], async (userId) => {
    try {
      await prisma.cart.deleteMany({ where: { userId } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getCarts = async (userIdProp?: string, locale?: string) => {
  const { userId } = await getServerUser()
  const activeUserId = userIdProp || userId
  const languageCode = locale?.toUpperCase()

  if (!activeUserId) {
    return []
  }

  const items = await prisma.cart.findMany({
    where: { userId: activeUserId },
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
              image: true,
            },
          },
          localizations: {
            where: { languageCode },
            take: 1,
            select: { name: true },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true, isPrimary: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return decimalToNumber(items).map((item) => ({
    ...item,
    product: transformProduct(item.product),
  }))
}

const getCartStat = async () => {
  const { userId } = await getServerUser()

  if (!userId) {
    return { totalCarts: 0 }
  }

  const totalCarts = await prisma.cart.count({
    where: { userId },
  })

  return { totalCarts }
}

export { createCart, updateCart, deleteCart, clearCart, getCarts, getCartStat }
export type { GetCartsResult, CartItem }
