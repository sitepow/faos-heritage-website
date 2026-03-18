'use server'

import { Role, type Prisma } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import type { BlogCategoryListFilters } from './query-key'

import { blogCategorySchema, type BlogCategoryInput } from './schema'

import { ERROR_CODES, fail, ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
import { withRole } from '@/lib/session'
import { applyLocalization } from '@/utils/localization'

const getBlogCategories = async ({
  isActive,
  search,
  locale,
}: BlogCategoryListFilters & { locale?: string } = {}) => {
  noStore()
  const languageCode = locale?.toUpperCase()

  const where: Prisma.BlogCategoryWhereInput = {
    ...(isActive !== undefined && { isActive }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  const categories = await prisma.blogCategory.findMany({
    where,
    include: {
      localizations: {
        where: { languageCode },
        take: 1,
      },
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return ok(categories.map((cat) => applyLocalization(cat)))
}

const getBlogCategory = async (id: string, locale?: string) => {
  const languageCode = locale?.toUpperCase()

  const category = await prisma.blogCategory.findUnique({
    where: { id },
    include: {
      localizations: {
        where: { languageCode },
        take: 1,
      },
      _count: {
        select: { posts: true },
      },
    },
  })

  return ok(applyLocalization(category))
}

const getBlogCategoryBySlug = async (slug: string, locale?: string) => {
  const languageCode = locale?.toUpperCase()

  const category = await prisma.blogCategory.findUnique({
    where: { slug },
    include: {
      localizations: {
        where: { languageCode },
        take: 1,
      },
    },
  })

  return applyLocalization(category)
}

const upsertBlogCategory = async (data: BlogCategoryInput) =>
  withRole([Role.ADMIN], async () => {
    const validated = blogCategorySchema.safeParse(data)
    if (!validated.success) {
      return fail(ERROR_CODES.VALIDATION_ERROR)
    }

    const { id, ...payload } = validated.data

    try {
      if (id) {
        await prisma.blogCategory.update({ where: { id }, data: payload })
      } else {
        await prisma.blogCategory.create({ data: payload })
      }
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const deleteBlogCategory = async (id: string | string[]) =>
  withRole([Role.ADMIN], async () => {
    try {
      const ids = Array.isArray(id) ? id : [id]
      await prisma.blogCategory.deleteMany({ where: { id: { in: ids } } })
      return ok()
    } catch {
      return fail(ERROR_CODES.SYSTEM_ERROR)
    }
  })

const getBlogCategoryStat = async () => {
  const [total, active, inactive] = await prisma.$transaction([
    prisma.blogCategory.count(),
    prisma.blogCategory.count({ where: { isActive: true } }),
    prisma.blogCategory.count({ where: { isActive: false } }),
  ])

  const labels = ['หมวดหมู่บทความทั้งหมด', 'เปิดใช้งานอยู่', 'ปิดใช้งานอยู่']
  const stats = [total, active, inactive]

  return stats.map((value, idx) => ({
    name: labels[idx],
    value,
  }))
}

type GetBlogCategoryResult = Awaited<ReturnType<typeof getBlogCategory>>
type GetBlogCategoriesResult = Awaited<ReturnType<typeof getBlogCategories>>

export {
  getBlogCategories,
  getBlogCategory,
  getBlogCategoryBySlug,
  upsertBlogCategory,
  deleteBlogCategory,
  getBlogCategoryStat,
}
export type {
  GetBlogCategoryResult,
  GetBlogCategoriesResult,
  BlogCategoryListFilters,
}
