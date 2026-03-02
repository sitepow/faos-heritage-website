'use server'

import { type Prisma } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'

import type { BlogCategoryListFilters } from './blog-category.query-key'

import { ok } from '@/lib/errors'
import { prisma } from '@/lib/prisma'
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

type GetBlogCategoryResult = Awaited<ReturnType<typeof getBlogCategory>>
type GetBlogCategoriesResult = Awaited<ReturnType<typeof getBlogCategories>>

export { getBlogCategories, getBlogCategory, getBlogCategoryBySlug }
export type {
  GetBlogCategoryResult,
  GetBlogCategoriesResult,
  BlogCategoryListFilters,
}
