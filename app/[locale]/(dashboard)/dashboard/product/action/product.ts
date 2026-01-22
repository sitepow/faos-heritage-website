'use server'

import type { ProductInput } from '../schema/product'
import type { Prisma } from '@prisma/client'

import { productSchema } from '../schema/product'

import { deleteFile } from '@/actions/file'
import { ERROR_CODES } from '@/lib/errors/codes'
import { done, fail } from '@/lib/errors/server'
import { prisma } from '@/lib/prisma'
import { decimalToNumber } from '@/utils/helpers/number'
import { removeEmptyField } from '@/utils/helpers/object'
import { getVariantPriceStockMinMax } from '@/utils/helpers/product'

export type GetProductResult = Awaited<ReturnType<typeof getProduct>>

export const createProduct = async (data: ProductInput) => {
  const validated = productSchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  try {
    await prisma.product.create({
      data: removeEmptyField(
        validated.data,
      ) as Prisma.ProductUncheckedCreateInput,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
}

export const deleteProduct = async (productIds: string | string[]) => {
  const ids = Array.isArray(productIds) ? productIds : [productIds]

  if (!ids.length) {
    return fail(ERROR_CODES.DATA_FIELD_REQUIRED)
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      id: true,
      images: {
        select: {
          url: true,
        },
      },
    },
  })

  for (const product of products) {
    for (const image of product.images) {
      await deleteFile(image.url)
    }
  }

  try {
    await prisma.product.deleteMany({
      where: {
        id: { in: ids },
      },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return done()
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
              where: {
                userId: userId,
              },
              select: {
                id: true,
              },
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
          select: {
            id: true,
            name: true,
          },
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

  const { priceMin, priceMax, stockMin, stockMax } = getVariantPriceStockMinMax(
    product.variants,
  )

  return {
    ...product,
    priceMin,
    priceMax,
    stockMin,
    stockMax,
    name: product?.localizations?.[0]?.name ?? product.name,
    shortDescription:
      product?.localizations?.[0]?.shortDescription ?? product.shortDescription,
    description:
      product?.localizations?.[0]?.description ?? product.description,
    metaTitle: product?.localizations?.[0]?.metaTitle ?? product.metaTitle,
    metaDescription:
      product?.localizations?.[0]?.metaDescription ?? product.metaDescription,
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
        images: {
          select: {
            url: true,
          },
        },
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
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ])

  const transformed = decimalToNumber(items)

  const productItems = transformed?.map((product) => {
    const { priceMin, priceMax, stockMin, stockMax } =
      getVariantPriceStockMinMax(product?.variants)

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

  return done()
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
