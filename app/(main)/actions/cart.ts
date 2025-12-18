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
      include: {
        variants: variantId ? { where: { id: variantId } } : false,
      },
    })

    if (!product) throw new Error('No specified product was found.')

    let availableStock = 0

    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId)

      if (!variant) throw new Error('No selected product variant was found.')
      availableStock = variant.stockQuantity
    } else {
      availableStock = product.stockQuantity
    }

    if (availableStock < 1) {
      throw new Error('Sorry, this item is out of stock.')
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
          throw new Error(
            'The number of items in the cart exceeds the available stock.',
          )
        }

        return await prisma.cart.update({
          where: { id: existing.id },
          data: { quantity: newQty },
        })
      }
    }

    return await prisma.cart.create({
      data: {
        userId,
        productId,
        variantId: variantId || null,
        quantity: 1,
      },
    })
  } catch (error) {
    return getPrismaError(error)
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

    const currentCartItem = await prisma.cart.findUnique({
      where: { id: cartId },
      select: { productId: true, variantId: true },
    })

    if (!currentCartItem) throw new Error('No items found in the cart.')

    const targetVariantId =
      variantId !== undefined ? variantId : currentCartItem.variantId

    const product = await prisma.product.findUnique({
      where: { id: currentCartItem.productId },
      include: {
        variants: targetVariantId ? { where: { id: targetVariantId } } : false,
      },
    })

    if (!product) throw new Error('No product information found.')

    let availableStock = 0

    if (targetVariantId) {
      const variant = product.variants.find((v) => v.id === targetVariantId)

      if (!variant)
        throw new Error(
          'No product variants were found matching the specified product.',
        )
      availableStock = variant.stockQuantity
    } else {
      availableStock = product.stockQuantity
    }

    if (quantity > availableStock) {
      throw new Error(
        `Sorry, we only have ${availableStock} pieces left in stock.`,
      )
    }

    return await prisma.cart.update({
      where: { id: cartId },
      data: {
        quantity,
        variantId: targetVariantId || null,
      },
    })
  } catch (error) {
    return getPrismaError(error)
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

const getCartStat = async (userId: string) => {
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
export { clearCart, createCart, deleteCart, getCarts, getCartStat, updateCart }
