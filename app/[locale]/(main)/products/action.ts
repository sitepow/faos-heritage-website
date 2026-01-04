'use server'

import { unstable_noStore as noStore } from 'next/cache'

import type { Product } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { getVariantPriceStockMinMax } from '@/utils/features'
import { decimalToNumber } from '@/utils/number'

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

export const getProducts = async ({
  cursor,
  limit = 8,
  categoryId,
  sortBy = { field: 'createdAt', order: 'desc' },
}: Props) => {
  noStore()

  let totalCount: number | undefined
  let where = {
    isActive: true,
    ...(categoryId && { categoryId }),
  }

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
      isAuthentic: true,
      isPremiumProduct: true,
      isDemoProduct: true,
      unit: true,
      images: { select: { url: true, isPrimary: true } },
      variants: {
        select: {
          image: true,
          price: true,
          stockQuantity: true,
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

  const transformed = decimalToNumber(items)
  const resultItems = (
    hasNextPage ? transformed.slice(0, limit) : transformed
  ).map((product) => {
    const { priceMin, priceMax, stockMin, stockMax } =
      getVariantPriceStockMinMax(product?.variants)

    return decimalToNumber({
      ...product,
      priceMin,
      priceMax,
      stockMin,
      stockMax,
    })
  })

  let nextCursor: string | null = null

  if (hasNextPage) {
    nextCursor = resultItems[resultItems.length - 1].id
  }

  return {
    items: resultItems,
    nextCursor,
    totalCount,
  }
}
