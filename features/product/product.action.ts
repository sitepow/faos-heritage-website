'use server'

import { Role, type Prisma } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import { transformProduct } from './product.helper'
import { productSchema, type ProductInput } from './product.schema'

import { deleteFile } from '@/app/actions/file'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { getServerUser, withRole } from '@/lib/session'
import { omitEmptyFields, decimalToNumber } from '@/utils'

const createProduct = async (data: ProductInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = productSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      const payload = omitEmptyFields(
        validated.data,
      ) as Prisma.ProductUncheckedCreateInput

      await prisma.product.create({ data: payload })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateProduct = async (data: ProductInput) =>
  withRole(['ADMIN'], async () => {
    const validated = productSchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
      await prisma.product.update({
        where: { id },
        data: payload as Prisma.ProductUncheckedUpdateInput,
      })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteProduct = async (productIds: string | string[]) =>
  withRole(['ADMIN'], async () => {
    const ids = Array.isArray(productIds) ? productIds : [productIds]
    if (!ids.length) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      const products = await prisma.product.findMany({
        where: { id: { in: ids } },
        select: { images: { select: { url: true } } },
      })

      const imageUrls = products.flatMap((p) => p.images.map((img) => img.url))
      await Promise.all(imageUrls.map((url) => deleteFile(url)))

      await prisma.product.deleteMany({ where: { id: { in: ids } } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getProduct = async (productId: string, locale?: string) => {
  const { userId } = await getServerUser()
  const languageCode = locale?.toUpperCase()

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: {
        include: {
          localizations: {
            where: { languageCode },
            take: 1,
          },
        },
      },
      images: { orderBy: { isPrimary: 'desc' } },
      variants: {
        include: {
          localizations: {
            where: { languageCode },
            take: 1,
          },
        },
      },
      localizations: {
        where: { languageCode },
        take: 1,
      },
      ...(userId && {
        cart: { where: { userId }, select: { variantId: true } },
        wishlist: { where: { userId }, select: { id: true } },
      }),
    },
  })

  return transformProduct(decimalToNumber(product))
}

const getProducts = async (page = 1, limit = 10, locale?: string) => {
  const skip = (page - 1) * limit
  const languageCode = locale?.toUpperCase()

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      skip,
      take: limit,
      include: {
        category: {
          include: {
            localizations: {
              where: { languageCode },
              take: 1,
            },
          },
        },
        images: { select: { url: true, isPrimary: true } },
        variants: {
          select: { price: true, salePrice: true, stockQuantity: true },
        },
        localizations: {
          where: { languageCode },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ])

  return {
    items: decimalToNumber(items).map(transformProduct),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

const getProductsInfinite = async ({
  cursor,
  limit = 8,
  categoryId,
  locale,
}: {
  cursor?: string | null
  limit?: number
  categoryId?: string | null
  locale?: string
}) => {
  noStore()
  const languageCode = locale?.toUpperCase()
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(categoryId && { categoryId }),
  }

  const [items, totalCount] = await Promise.all([
    prisma.product.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      include: {
        category: {
          include: {
            localizations: {
              where: { languageCode },
              take: 1,
            },
          },
        },
        images: { select: { url: true, isPrimary: true } },
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            salePrice: true,
            stockQuantity: true,
            image: true,
          },
        },
        localizations: {
          where: { languageCode },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    cursor ? Promise.resolve(undefined) : prisma.product.count({ where }),
  ])

  const hasNextPage = items.length > limit
  const pagedItems = hasNextPage ? items.slice(0, limit) : items
  const resultItems = decimalToNumber(pagedItems).map(transformProduct)

  const nextCursor = hasNextPage
    ? resultItems[resultItems.length - 1]?.id
    : null

  return { items: resultItems, nextCursor, totalCount }
}

const getProductStat = async () =>
  withRole(['ADMIN'], async () => {
    const stats = await prisma.$transaction([
      prisma.product.count(),
      prisma.product.count({ where: { stockQuantity: { gt: 0 } } }),
      prisma.product.count({ where: { stockQuantity: 0 } }),
    ])

    const labels = ['สินค้าทั้งหมด', 'สินค้าพร้อมจำหน่าย', 'สินค้าหมดสต็อก']
    return stats.map((value, idx) => ({ name: labels[idx], value }))
  })

const increaseProductView = async (id: string) => {
  if (!id) {
    return fail(ERROR_CODES.BAD_REQUEST)
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    return ok()
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }
}

type ProductWithPayload = Awaited<ReturnType<typeof getProduct>>
type ProductListItem = NonNullable<
  Awaited<ReturnType<typeof getProducts>>['items']
>[number]

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsInfinite,
  getProductStat,
  increaseProductView,
}

export type { ProductWithPayload, ProductListItem }
