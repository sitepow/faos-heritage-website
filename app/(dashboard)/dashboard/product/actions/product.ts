'use server'

import type { ProductInput } from '../schema/product'
import type { Prisma } from '@prisma/client'

import { productSchema } from '../schema/product'

import { getPriceMinMaxFromVariants, removeEmptyField } from '@/utils/helper'
import { getPrismaError, prisma } from '@/utils/prisma'

type GetProductResult = Awaited<ReturnType<typeof getProduct>>

const createProduct = async (data: ProductInput) => {
  try {
    const validatedData = productSchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
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
      throw new Error('โปรดระบุรหัสสินค้าที่ต้องการ')
    }

    await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getProduct = async (productId: string, userId?: string) => {
  try {
    if (!productId) {
      throw new Error('โปรดระบุรหัสสินค้าที่ต้องการ')
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
      throw new Error('ไม่พบข้อมูลสินค้า')
    }

    const { priceMin, priceMax } = getPriceMinMaxFromVariants(product.variants)

    return { ...product, priceMin, priceMax }
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

    return {
      items,
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
          'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
      )
    }

    const { id, ...payload } = validatedData.data

    if (!id) throw new Error('ไม่พบรหัสสินค้า')

    await prisma.product.update({
      data: payload as Prisma.ProductUncheckedUpdateInput,
      where: { id },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getProductDashboard = async () => {
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
      { name: 'สินค้าทั้งหมด', value: totalProducts },
      { name: 'สินค้าทั้งหมด (พร้อมขาย)', value: inStock },
      { name: 'สินค้าทั้งหมด (ไม่พร้อมขาย)', value: outOfStock },
    ]
  } catch (error) {
    getPrismaError(error)
  }
}

export type { GetProductResult }
export {
  createProduct,
  deleteProduct,
  getProductDashboard,
  getProduct,
  getProducts,
  updateProduct,
}
