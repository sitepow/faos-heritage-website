'use server'

import { type Prisma } from '@prisma/client'

import { type BlogCategoryListFilters } from './blog-category.query-key'

import { prisma } from '@/lib/prisma'
import { applyLocalization } from '@/utils/localization'

type GetBlogCategoryResult = Awaited<ReturnType<typeof getBlogCategory>>
type GetBlogCategoriesResult = Awaited<ReturnType<typeof getBlogCategories>>

const getBlogCategories = async (
  filters: BlogCategoryListFilters = {},
  locale?: string,
) => {
  const { isActive, search } = filters
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

  return categories.map((cat) => applyLocalization(cat))
}

const getBlogCategory = async (id: string, locale?: string) => {
  const languageCode = locale?.toUpperCase()

  try {
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
    return applyLocalization(category)
  } catch {
    return null
  }
}

const getBlogCategoryBySlug = async (slug: string, locale?: string) => {
  const languageCode = locale?.toUpperCase()

  try {
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
  } catch {
    return null
  }
}

export { getBlogCategories, getBlogCategory, getBlogCategoryBySlug }
export type { GetBlogCategoryResult, GetBlogCategoriesResult }
