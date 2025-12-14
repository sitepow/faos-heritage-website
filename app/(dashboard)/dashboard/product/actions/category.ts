'use server'

import type { CategoryInput } from '../schema/category'
import type { Prisma } from '@prisma/client'

import { deleteFile } from './file'
import { categorySchema } from '../schema/category'

import { removeEmptyField } from '@/utils/helper'
import { getPrismaError, prisma } from '@/utils/prisma'

const EXECUTE_FIELD = {
  id: true,
  name: true,
  slug: true,
  isActive: true,
  image: true,
}

type GetCategoryResult = Awaited<ReturnType<typeof getCategory>>
type GetCategoriesResult = Awaited<ReturnType<typeof getCategories>>

const createCategory = async (data: CategoryInput) => {
  try {
    const validatedData = categorySchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    await prisma.category.create({
      data: removeEmptyField(
        validatedData.data,
      ) as Prisma.ProductVariantCreateInput,
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const getCategories = async () => {
  try {
    return prisma.category.findMany({
      select: EXECUTE_FIELD,
      orderBy: { name: 'desc' },
    })
  } catch (error) {
    getPrismaError(error)

    return []
  }
}

const getCategory = async (categoryId: string) => {
  try {
    if (!categoryId) {
      throw new Error('Please specify the product code you want.')
    }

    const variant = await prisma.category.findUnique({
      where: { id: categoryId },
      select: EXECUTE_FIELD,
    })

    if (!variant) {
      throw new Error('No product option information found.')
    }

    return variant
  } catch (error) {
    getPrismaError(error)
  }
}

const updateCategory = async (data: CategoryInput) => {
  try {
    const validatedData = categorySchema.safeParse(data)

    if (!validatedData?.success) {
      throw new Error(
        validatedData?.error?.issues[0]?.message ??
          'An error occurred. Please try again.',
      )
    }

    const { id, ...payload } = validatedData.data

    if (!id) throw new Error('Product code not found.')

    await prisma.category.update({
      data: payload as Prisma.ProductVariantCreateInput,
      where: { id },
    })
  } catch (error) {
    getPrismaError(error)
  }
}

const deleteCategory = async (categoryIds: string | string[]) => {
  try {
    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds]

    if (!ids.length) {
      throw new Error('Please specify the category code you wish to delete.')
    }

    const categories = await prisma.category.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        image: true,
      },
    })

    await Promise.all(
      categories
        .map((category) => category.image)
        .filter(Boolean)
        .map((imagePath) => deleteFile(imagePath!)),
    )

    await prisma.$transaction([
      prisma.category.deleteMany({
        where: {
          id: { in: ids },
        },
      }),
    ])
  } catch (error) {
    getPrismaError(error)
  }
}

export type { GetCategoryResult, GetCategoriesResult }
export {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
}
