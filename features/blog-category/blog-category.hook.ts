'use client'

import { useQuery } from '@tanstack/react-query'

import { getBlogCategories, getBlogCategory } from './blog-category.action'
import {
  blogCategoryQueryKeys,
  type BlogCategoryListFilters,
} from './blog-category.query-key'

interface UseBlogCategoryParams {
  id: string
  locale?: string
}

interface UseBlogCategoriesParams {
  filters?: BlogCategoryListFilters
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
  filters = {},
  locale,
}: UseBlogCategoriesParams) => {
  return useQuery({
    queryKey: [...blogCategoryQueryKeys.lists.filtered(filters), locale],
    queryFn: () => getBlogCategories(filters, locale),
  })
}

export { useBlogCategory, useBlogCategories }
