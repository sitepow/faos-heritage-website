'use server'

import type { ProductInput } from '../schema/product'
import type { Prisma } from '@prisma/client'

import { deleteFileSupabase } from '../../../actions/file'
import { productSchema } from '../schema/product'

import { getVariantPriceStockMinMax, removeEmptyField } from '@/utils/helper'
import { getPrismaError, prisma } from '@/utils/prisma'

type GetProductResult = Awaited<ReturnType<typeof getProduct>>

const createProduct = async (data: ProductInput) => {
  try {
    const validatedData = productSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    await prisma.product.create({
      data: removeEmptyField(
        validatedData.data,
      ) as Prisma.ProductUncheckedCreateInput,
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const deleteProduct = async (productIds: string | string[]) => {
  try {
    const ids = Array.isArray(productIds) ? productIds : [productIds]

    if (!ids.length) {
      throw new Error('Please specify the product code you want.')
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
        await deleteFileSupabase(image.url)
      }
    }

    await prisma.product.deleteMany({
      where: {
        id: { in: ids },
      },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getProduct = async (productId: string, userId?: string) => {
  try {
    if (!productId) {
      throw new Error('Please specify the product code you want.')
    }

    const product = await prisma.product.findUnique({
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
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            url: true,
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
    })

    if (!product) {
      throw new Error('No product information found.')
    }

    const { priceMin, priceMax, stockMin, stockMax } =
      getVariantPriceStockMinMax(product.variants)

    return { ...product, priceMin, priceMax, stockMin, stockMax }
  } catch (error) {
    getPrismaError(error)
  }
}

const getProducts = async (page: number = 1, limit: number = 10) => {
  try {
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

    const resultItems = items?.map((product) => {
      const { priceMin, priceMax, stockMin, stockMax } =
        getVariantPriceStockMinMax(product?.variants)

      return {
        ...product,
        priceMin,
        priceMax,
        stockMin,
        stockMax,
      }
    })

    return {
      items: resultItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    getPrismaError(error)
  }
}

const updateProduct = async (data: ProductInput) => {
  try {
    const validatedData = productSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    const { id, ...payload } = validatedData.data

    if (!id) throw new Error('Product ID not found.')

    await prisma.product.update({
      data: payload as Prisma.ProductUncheckedUpdateInput,
      where: { id },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getProductStat = async () => {
  try {
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
      { name: 'All products', value: totalProducts },
      { name: 'All products (Ready for sale)', value: inStock },
      { name: 'All products (Not available for sale)', value: outOfStock },
    ]
  } catch (error) {
    getPrismaError(error)
  }
}

export type { GetProductResult }
export {
  createProduct,
  deleteProduct,
  getProductStat,
  getProduct,
  getProducts,
  updateProduct,
}
