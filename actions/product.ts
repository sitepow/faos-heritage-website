'use server'

import type { Product } from '@prisma/client'

import { getPriceAndStockMinMaxFromVariants } from '@/utils/helper'
import { getPrismaError, prisma } from '@/utils/prisma'

export type GetProductsResult = Awaited<ReturnType<typeof getProducts>>
export type GetProductResult = GetProductsResult['items'][number]

type SortOrder = 'asc' | 'desc'

interface SortByItem {
  readonly field: keyof Product
  readonly order: SortOrder
}

interface Props {
  cursor?: string | null
  limit?: number
  categoryId?: string | null
  sortBy?: SortByItem
}

const getProducts = async ({
  cursor,
  limit = 8,
  categoryId,
  sortBy = { field: 'createdAt', order: 'desc' },
}: Props) => {
  let totalCount: number | undefined
  let where = {
    isActive: true,
    ...(categoryId && { categoryId }),
  }

  try {
    if (!cursor) {
      totalCount = await prisma.product.count({ where })
    }

    const items = await prisma.product.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      select: {
        id: true,
        name: true,
        price: true,
        stockQuantity: true,
        isDigitalProduct: true,
        isDemoProduct: true,
        unit: true,
        images: { select: { url: true } },
        variants: {
          select: {
            price: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        [sortBy.field]: sortBy.order,
      },
    })

    const hasNextPage = items.length > limit

    const resultItems = (hasNextPage ? items.slice(0, limit) : items).map(
      (product) => {
        const { priceMin, priceMax, stockMin, stockMax } =
          getPriceAndStockMinMaxFromVariants(product?.variants)

        return {
          ...product,
          priceMin,
          priceMax,
          stockMin,
          stockMax,
        }
      },
    )

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

export { getProducts }
