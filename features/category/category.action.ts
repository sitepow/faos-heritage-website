'use server'

import type { CategoryInput } from './category.schema'
import type { Prisma } from '@prisma/client'

import { categorySchema } from './category.schema'

import { deleteFile } from '@/app/actions/file'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { omitEmptyFields } from '@/utils/app'

export type GetCategoryResult = Awaited<ReturnType<typeof getCategory>>
export type GetCategoriesResult = Awaited<ReturnType<typeof getCategories>>

export const createCategory = async (data: CategoryInput) => {
  const validated = categorySchema.safeParse(data)

  if (!validated.success) {
    return fail(ERROR_CODES.VALIDATION_ERROR)
  }

  const exists = await prisma.category.findFirst({
    where: { name: validated.data.name },
  })

  if (exists) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  try {
    await prisma.category.create({
      data: omitEmptyFields(
        validated.data,
      ) as Prisma.CategoryUncheckedCreateInput,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      image: true,
    },
    orderBy: { name: 'asc' },
  })

  return categories
}

export const getCategory = async (categoryId: string) => {
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

  if (!category) {
    return
  }

  return category
}

export const updateCategory = async (data: CategoryInput) => {
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
      data: omitEmptyFields(payload) as Prisma.CategoryUncheckedCreateInput,
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}

export const deleteCategory = async (categoryIds: string | string[]) => {
  const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds]

  if (!ids.length) {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  const categories = await prisma.category.findMany({
    where: { id: { in: ids } },
    select: { image: true },
  })

  if (!categories) {
    return fail(ERROR_CODES.DATA_NOT_FOUND)
  }

  try {
    await Promise.all(
      categories
        .map((category) => category.image)
        .filter(Boolean)
        .map((image) => deleteFile(image!)),
    )

    await prisma.category.deleteMany({
      where: { id: { in: ids } },
    })
  } catch {
    return fail(ERROR_CODES.SYSTEM_ERROR)
  }

  return ok()
}
