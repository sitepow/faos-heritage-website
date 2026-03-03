'use server'

import { Role, type Prisma } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import { categorySchema, type CategoryInput } from './category.schema'

import { deleteFile } from '@/app/actions/file'
import { fail, ok } from '@/lib/errors'
import { ERROR_CODES } from '@/lib/errors/error-codes'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { omitEmptyFields } from '@/utils'
import { applyLocalization } from '@/utils/localization'

const getCategoryBySlug = async (slug: string, locale?: string) => {
  const languageCode = locale?.toUpperCase()

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      localizations: {
        where: { languageCode },
        take: 1,
      },
      _count: {
        select: { products: true },
      },
    },
  })

  if (!category) {
    return null
  }

  return applyLocalization(category)
}

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

      await prisma.category.deleteMany({ where: { id: { in: ids } } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getCategoriesAdmin = async () => {
  noStore()
  const items = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return items
}

const getCategoryAdmin = async (id: string) => {
  const item = await prisma.category.findUnique({
    where: { id },
  })
  return item
}

const getCategories = async (locale?: string) => {
  noStore()
  const languageCode = locale?.toUpperCase()

  const categories = await prisma.category.findMany({
    include: {
      localizations: {
        where: { languageCode },
        take: 1,
      },
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return categories.map((cat) => applyLocalization(cat))
}

const getCategory = async (categoryId: string, locale?: string) => {
  const languageCode = locale?.toUpperCase()

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      localizations: {
        where: { languageCode },
        take: 1,
      },
      _count: {
        select: { products: true },
      },
    },
  })

  return applyLocalization(category)
}

const getCategoryStat = async () =>
  withRole([Role.ADMIN], async () => {
    noStore()
    const [total, active, inactive] = await prisma.$transaction([
      prisma.category.count(),
      prisma.category.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: false } }),
    ])

    const labels = ['หมวดหมู่ทั้งหมด', 'เปิดใช้งานอยู่', 'ปิดใช้งานอยู่']
    const stats = [total, active, inactive]

    return stats.map((value, idx) => ({ name: labels[idx], value }))
  })

type GetCategoryResult = Awaited<ReturnType<typeof getCategory>>
type GetCategoriesResult = Awaited<ReturnType<typeof getCategories>>

export {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesAdmin,
  getCategoryAdmin,
  getCategory,
  getCategories,
  getCategoryBySlug,
  getCategoryStat,
}

export type { GetCategoryResult, GetCategoriesResult }
