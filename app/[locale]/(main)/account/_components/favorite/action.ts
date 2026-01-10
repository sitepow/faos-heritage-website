'use server'

import type { Wishlist } from '@prisma/client'

import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { decimalToNumber } from '@/utils/helpers/number'
import { getVariantPriceStockMinMax } from '@/utils/helpers/product'

export type GetFavoritesResult = Awaited<ReturnType<typeof getFavorites>>
export type GetFavoriteResult = GetFavoritesResult['items'][number]

type SortOrder = 'asc' | 'desc'

interface SortByItem {
  readonly field: keyof Wishlist
  readonly order: SortOrder
}

interface GetFavoritesProps {
  cursor?: string | null
  limit?: number
  userId?: string | null
  sortBy?: SortByItem
}

export const getFavorites = async ({
  cursor,
  limit = 8,
  userId,
  sortBy = { field: 'createdAt', order: 'desc' },
}: GetFavoritesProps) => {
  let totalCount: number | undefined
  const where = userId ? { userId } : undefined

  if (!cursor) {
    totalCount = await prisma.wishlist.count({ where })
  }

  const items = await prisma.wishlist.findMany({
    take: limit + 1,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where,
    select: {
      id: true,
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          unit: true,
          variants: {
            select: {
              price: true,
            },
          },
          shortDescription: true,
          images: {
            select: {
              url: true,
              isPrimary: true,
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

  const transformed = decimalToNumber(items)
  const favoriteItems = (
    hasNextPage ? transformed.slice(0, limit) : transformed
  ).map((product) => {
    const { priceMin, priceMax, stockMin, stockMax } =
      getVariantPriceStockMinMax(product?.product?.variants)

    return {
      ...product,
      priceMin,
      priceMax,
      stockMin,
      stockMax,
    }
  })

  let nextCursor: string | null = null

  if (hasNextPage) {
    nextCursor = favoriteItems[favoriteItems.length - 1].id
  }

  return {
    items: favoriteItems,
    nextCursor,
    totalCount,
  }
}

export const createFavorite = async (userId: string, productId: string) => {
  if (!userId || !productId) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  })

  if (existing) {
    return fail(ERROR_CODES.DATA_ALREADY_EXISTS)
  }

  try {
    await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const deleteFavorite = async ({
  favoriteId,
  userId,
  productId,
}: {
  favoriteId?: string
  userId?: string
  productId?: string
}) => {
  try {
    if (favoriteId) {
      return await prisma.wishlist.delete({ where: { id: favoriteId } })
    }

    if (userId && productId) {
      return await prisma.wishlist.deleteMany({ where: { userId, productId } })
    }
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}
