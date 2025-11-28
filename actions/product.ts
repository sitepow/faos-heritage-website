'use server'

import { PrismaClient } from '@prisma/client'

import { getPrismaError } from '@/utils/prisma'

const prisma = new PrismaClient()

export type GetProductsResult = Awaited<ReturnType<typeof getProducts>>
export type ProductItem = GetProductsResult['items'][number]

export const getProducts = async ({
  cursor,
  limit = 8,
}: {
  cursor?: string | null
  limit?: number
}) => {
  let totalCount: number | undefined

  try {
    if (!cursor) {
      totalCount = await prisma.product.count()
    }

    const items = await prisma.product.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        name: true,
        price: true,
        images: { select: { url: true } },
      },
      orderBy: { createdAt: 'desc' },
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
