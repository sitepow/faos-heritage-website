'use server'

import { unstable_noStore as noStore } from 'next/cache'

import type { Prisma, Product } from '@prisma/client'

import { productSchema, type ProductInput } from './product.schema'

import { deleteFile } from '@/app/actions/file'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import {
  omitEmptyFields,
  decimalToNumber,
  calculateVariantRange,
} from '@/utils'

export type GetProductResult = Awaited<ReturnType<typeof getProduct>>
export type GetProductsResult = Awaited<ReturnType<typeof getProducts>>
// export type ProductListItem = GetProductsResult['items'][number]

type SortOrder = 'asc' | 'desc'
interface SortByItem {
  readonly field: keyof Product
  readonly order: SortOrder
}

export type GetProductsInfiniteResult = Awaited<
  ReturnType<typeof getProductsInfinite>
>

export type ProductListItem = NonNullable<
  GetProductsInfiniteResult['items']
>[number]

interface GetProductsInfiniteProps {
  cursor?: string | null
  limit?: number
  categoryId?: string | null
  sortBy?: SortByItem
  locale?: string
}

export const createProduct = async (data: ProductInput) => {
  const validated = productSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  try {
    await prisma.product.create({
      data: omitEmptyFields(
        validated.data,
      ) as Prisma.ProductUncheckedCreateInput,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const updateProduct = async (data: ProductInput) => {
  const validated = productSchema.safeParse(data)

  if (!validated?.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const { id, ...payload } = validated.data

  if (!id) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  try {
    await prisma.product.update({
      data: payload as Prisma.ProductUncheckedUpdateInput,
      where: { id },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const deleteProduct = async (productIds: string | string[]) => {
  const ids = Array.isArray(productIds) ? productIds : [productIds]

  if (!ids.length) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      images: { select: { url: true } },
    },
  })

  for (const product of products) {
    for (const image of product.images) {
      await deleteFile(image.url)
    }
  }

  try {
    await prisma.product.deleteMany({
      where: { id: { in: ids } },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const getProduct = async (
  productId: string,
  userId?: string,
  locale?: string,
) => {
  const product = decimalToNumber(
    await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        barcode: true,
        price: true,
        compareAtPrice: true,
        costPrice: true,
        stockQuantity: true,
        lowStockAlert: true,
        weight: true,
        categoryId: true,
        shortDescription: true,
        isAuthentic: true,
        isPremiumProduct: true,
        isDigitalProduct: true,
        isDemoProduct: true,
        unit: true,
        cart: userId
          ? {
              where: { userId },
              select: { variantId: true },
            }
          : false,
        wishlist: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            stockQuantity: true,
            image: true,
          },
        },
        category: {
          select: { id: true, name: true },
        },
        images: {
          orderBy: { isPrimary: 'desc' },
          select: {
            url: true,
            alt: true,
            isPrimary: true,
          },
        },
        localizations: {
          where: { languageCode: locale?.toLocaleUpperCase() },
          take: 1,
          select: {
            name: true,
            shortDescription: true,
            description: true,
            metaTitle: true,
            metaDescription: true,
          },
        },
        description: true,
        metaTitle: true,
        metaDescription: true,
        isActive: true,
        useSeoFromBasicData: true,
        isFeatured: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  )

  if (!product) {
    return
  }

  const { priceMin, priceMax, stockMin, stockMax } = calculateVariantRange(
    product.variants,
  )

  const localization = product?.localizations?.[0]

  return {
    ...product,
    priceMin,
    priceMax,
    stockMin,
    stockMax,
    name: localization?.name ?? product.name,
    shortDescription:
      localization?.shortDescription ?? product.shortDescription,
    description: localization?.description ?? product.description,
    metaTitle: localization?.metaTitle ?? product.metaTitle,
    metaDescription: localization?.metaDescription ?? product.metaDescription,
  }
}

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  locale?: string,
) => {
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        unit: true,
        isDigitalProduct: true,
        stockQuantity: true,
        images: { select: { url: true } },
        variants: {
          select: {
            name: true,
            price: true,
            stockQuantity: true,
          },
        },
        localizations: {
          where: { languageCode: locale?.toLocaleUpperCase() },
          take: 1,
          select: { name: true },
        },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ])

  const transformed = decimalToNumber(items)

  const productItems = transformed?.map((product) => {
    const { priceMin, priceMax, stockMin, stockMax } = calculateVariantRange(
      product?.variants,
    )

    return {
      ...product,
      priceMin,
      priceMax,
      stockMin,
      stockMax,
      name: product?.localizations?.[0]?.name ?? product.name,
    }
  })

  return {
    items: productItems,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export const getProductsInfinite = async ({
  cursor,
  limit = 8,
  categoryId,
  sortBy = { field: 'createdAt', order: 'desc' },
  locale,
}: GetProductsInfiniteProps) => {
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
      category: { select: { name: true } },
      localizations: {
        where: { languageCode: locale?.toLocaleUpperCase() },
        take: 1,
        select: { name: true },
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
    const { priceMin, priceMax, stockMin, stockMax } = calculateVariantRange(
      product?.variants,
    )

    return {
      ...product,
      priceMin,
      priceMax,
      stockMin,
      stockMax,
      name: product?.localizations?.[0]?.name ?? product.name,
    }
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

export const getProductStat = async () => {
  const [totalProducts, inStock, outOfStock] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({
      where: { stockQuantity: { gt: 0 } },
    }),
    prisma.product.count({
      where: { stockQuantity: 0 },
    }),
  ])

  return [
    { name: 'สินค้าทั้งหมด', value: totalProducts },
    { name: 'สินค้าพร้อมจำหน่าย', value: inStock },
    { name: 'สินค้าไม่พร้อมจำหน่าย (หมดสต็อก)', value: outOfStock },
  ]
}
