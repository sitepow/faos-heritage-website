'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getBlogCategories,
  getBlogCategory,
  getBlogCategoryStat,
} from './blog-category.action'
import { blogCategoryQueryKeys } from './blog-category.query-key'

interface UseBlogCategoryParams {
  id: string
  locale?: string
}

interface UseBlogCategoriesParams {
  isActive?: boolean
  search?: string
  locale?: string
}

const useBlogCategory = ({ id, locale }: UseBlogCategoryParams) => {
  return useQuery({
    queryKey: [...blogCategoryQueryKeys.details.byId(id), locale],
    queryFn: () => getBlogCategory(id, locale),
    enabled: !!id,
  })
}

const useBlogCategories = ({
  isActive,
  search,
  locale,
}: UseBlogCategoriesParams = {}) => {
  return useQuery({
    queryKey: [
      ...blogCategoryQueryKeys.lists.filtered({ isActive, search }),
      locale,
    ],
    queryFn: () => getBlogCategories({ isActive, search, locale }),
  })
}

const useBlogCategoryStat = () => {
  return useQuery({
    queryKey: blogCategoryQueryKeys.stats(),
    queryFn: () => getBlogCategoryStat(),
  })
}

export { useBlogCategory, useBlogCategories, useBlogCategoryStat }
