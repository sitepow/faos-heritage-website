'use server'

import type { Wishlist } from '@prisma/client'

import { getPrismaError, prisma } from '@/utils/prisma'

export type GetFavoritesResult = Awaited<ReturnType<typeof getFavorites>>
export type FavoriteItem = GetFavoritesResult['items'][number]

type SortOrder = 'asc' | 'desc'

interface SortByItem {
  readonly field: keyof Wishlist
  readonly order: SortOrder
}

interface Props {
  cursor?: string | null
  limit?: number
  userId?: string | null
  sortBy?: SortByItem
}

const getFavorites = async ({
  cursor,
  limit = 8,
  userId,
  sortBy = { field: 'createdAt', order: 'desc' },
}: Props) => {
  let totalCount: number | undefined
  const where = userId ? { userId } : undefined

  try {
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
            shortDescription: true,
            images: {
              select: {
                url: true,
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
      totalCount,
    }
  } catch (error) {
    getPrismaError(error)

    return { items: [], nextCursor: null, totalCount: cursor ? undefined : 0 }
  }
}

const createFavorite = async (userId: string, productId: string) => {
  try {
    if (!userId || !productId) {
      throw new Error('กรุณาระบุข้อมูลให้ถูกต้อง (ไอดีผู้ใช้งาน, รหัสสินค้า)')
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
      throw new Error(
        'คุณได้เพิ่มสินค้านี้เข้าในรายการโปรดไว้แล้ว โปรดเลือกสินค้าชิ้นใหม่ที่ต้องการ',
      )
    }

    await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const deleteFavorite = async ({
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
      await prisma.wishlist.delete({ where: { id: favoriteId } })

      return
    }

    if (userId && productId) {
      await prisma.wishlist.deleteMany({ where: { userId, productId } })

      return
    }
  } catch (error) {
    getPrismaError(error)
  }
}

const getDashboard = async (userId: string) => {
  try {
    const totalFavorites = await prisma.wishlist.count({
      where: {
        userId,
      },
    })

    return {
      totalFavorites,
    }
  } catch (error) {
    getPrismaError(error)
  }
}

export { createFavorite, deleteFavorite, getDashboard, getFavorites }
