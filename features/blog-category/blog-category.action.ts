'use server'

import { type Prisma } from '@prisma/client'

import { type BlogCategoryListFilters } from './blog-category.query-key'

import { prisma } from '@/lib/prisma'

type GetBlogCategoryResult = Awaited<ReturnType<typeof getBlogCategory>>
type GetBlogCategoriesResult = Awaited<ReturnType<typeof getBlogCategories>>

const getBlogCategories = async (filters: BlogCategoryListFilters = {}) => {
  const { isActive, search } = filters

  const where: Prisma.BlogCategoryWhereInput = {
    ...(isActive !== undefined && { isActive }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ],
    }),
  }

  return await prisma.blogCategory.findMany({
    where,
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      isActive: true,
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

const getBlogCategory = async (id: string) => {
  try {
    const category = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })
    return category || null
  } catch {
    return null
  }
}

const getBlogCategoryBySlug = async (slug: string) => {
  try {
    const category = await prisma.blogCategory.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })
    return category || null
  } catch {
    return null
  }
}

export { getBlogCategories, getBlogCategory, getBlogCategoryBySlug }
export type { GetBlogCategoryResult, GetBlogCategoriesResult }
