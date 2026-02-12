'use server'

import { Role, type Prisma } from '@prisma/client'

import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'
import { calculateVariantRange } from '@/utils'
import { decimalToNumber } from '@/utils/number'

interface GetFavoritesProps {
  cursor?: string | null
  limit?: number
  userId?: string | null
}

type GetFavoritesResult = Awaited<ReturnType<typeof getFavorites>>
type FavoriteListItem = GetFavoritesResult['items'][number]

const createFavorite = async (productId: string) =>
  withRole([Role.CUSTOMER, Role.ADMIN], async (userId) => {
    if (!productId) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      const existing = await prisma.wishlist.findUnique({
        where: {
          userId_productId: { userId, productId },
        },
      })

      if (existing) {
        return ok()
      }

      await prisma.wishlist.create({
        data: { userId, productId },
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteFavorite = async (input: {
  favoriteId?: string
  productId?: string
}) =>
  withRole([Role.CUSTOMER, Role.ADMIN], async (userId) => {
    const { favoriteId, productId } = input

    try {
      if (favoriteId) {
        await prisma.wishlist.delete({
          where: { id: favoriteId, userId },
        })
      } else if (productId) {
        await prisma.wishlist.delete({
          where: { userId_productId: { userId, productId } },
        })
      } else {
        return fail(ERROR_CODES.BAD_REQUEST)
      }

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getFavorites = async ({
  cursor,
  limit = 8,
  userId: propUserId,
}: GetFavoritesProps) => {
  const { userId } = await getServerUser()
  const activeUserId = propUserId || userId

  if (!activeUserId) {
    return { items: [], nextCursor: null, totalCount: 0 }
  }

  const where: Prisma.WishlistWhereInput = { userId: activeUserId }

  const [items, totalCount] = await Promise.all([
    prisma.wishlist.findMany({
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
            variants: { select: { price: true } },
            summary: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    }),
    cursor ? Promise.resolve(undefined) : prisma.wishlist.count({ where }),
  ])

  const hasNextPage = items.length > limit
  const transformed = decimalToNumber(
    hasNextPage ? items.slice(0, limit) : items,
  )

  const favoriteItems = transformed.map((item) => {
    const { priceMin, priceMax } = calculateVariantRange(item.product?.variants)
    return {
      ...item,
      priceMin,
      priceMax,
    }
  })

  const nextCursor = hasNextPage
    ? favoriteItems[favoriteItems.length - 1].id
    : null

  return {
    items: favoriteItems,
    nextCursor,
    totalCount,
  }
}

export { getFavorites, createFavorite, deleteFavorite }

export type { GetFavoritesProps, GetFavoritesResult, FavoriteListItem }
