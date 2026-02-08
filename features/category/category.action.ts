'use server'

import { Role, type Prisma } from '@prisma/client'

import { categorySchema, type CategoryInput } from './category.schema'

import { deleteFile } from '@/app/actions/file'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'

type GetCategoryResult = Awaited<ReturnType<typeof getCategory>>
type GetCategoriesResult = Awaited<ReturnType<typeof getCategories>>

const createCategory = async (data: CategoryInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = categorySchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    try {
      const exists = await prisma.category.findFirst({
        where: { name: { equals: validated.data.name, mode: 'insensitive' } },
      })

      if (exists) {
        return fail(ERROR_CODES.BAD_REQUEST)
      }

      await prisma.category.create({
        data: omitEmptyFields(
          validated.data,
        ) as Prisma.CategoryUncheckedCreateInput,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const updateCategory = async (data: CategoryInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = categorySchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validated.data
    if (!id) {
      return fail(ERROR_CODES.DATA_NOT_FOUND)
    }

    try {
      await prisma.category.update({
        where: { id },
        data: omitEmptyFields(payload) as Prisma.CategoryUncheckedUpdateInput,
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteCategory = async (categoryIds: string | string[]) =>
  withRole([Role.ADMIN], async () => {
    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds]
    if (!ids.length) {
      return fail(ERROR_CODES.BAD_REQUEST)
    }

    try {
      const categories = await prisma.category.findMany({
        where: { id: { in: ids } },
        select: { image: true },
      })

      const imagesToDelete = categories
        .map((c) => c.image)
        .filter(Boolean) as string[]
      if (imagesToDelete.length > 0) {
        await Promise.all(imagesToDelete.map((url) => deleteFile(url)))
      }

      await prisma.category.deleteMany({
        where: { id: { in: ids } },
      })

      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getCategories = async () => {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      image: true,
    },
    orderBy: { name: 'asc' },
  })
}

const getCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      image: true,
    },
  })
  return category || null
}

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
}

export type { GetCategoryResult, GetCategoriesResult }
