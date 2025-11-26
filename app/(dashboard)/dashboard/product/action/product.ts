'use server'

import { PrismaClient } from '@prisma/client'

import type { ProductInput } from '../schema/product'
import type { Prisma } from '@prisma/client'

import { productSchema } from '../schema/product'

import { removeEmptyField } from '@/utils/helper'
import { getPrismaError } from '@/utils/prisma'

const prisma = new PrismaClient()

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

const getProduct = async (productId: string) => {
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

    return product
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
          stockQuantity: true,
          variants: {
            select: {
              name: true,
              price: true,
              stockQuantity: true,
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

const getDashboard = async () => {
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
      { name: 'พร้อมขาย (ยังมีสินค้า)', value: inStock },
      { name: 'ไม่พร้อมขาย (สินค้าหมด)', value: outOfStock },
    ]
  } catch (error) {
    getPrismaError(error)
  }
}

export {
  createProduct,
  deleteProduct,
  getDashboard,
  getProduct,
  getProducts,
  updateProduct,
}
