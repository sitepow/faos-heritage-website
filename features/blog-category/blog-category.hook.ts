'use client'

import { useQuery } from '@tanstack/react-query'

import { getBlogCategories, getBlogCategory } from './blog-category.action'
import {
  blogCategoryQueryKeys,
  type BlogCategoryListFilters,
} from './blog-category.query-key'

const useBlogCategory = (id: string) => {
  return useQuery({
    queryKey: blogCategoryQueryKeys.details.byId(id),
    queryFn: () => getBlogCategory(id),
    enabled: !!id,
  })
}

const useBlogCategories = (filters: BlogCategoryListFilters = {}) => {
  return useQuery({
    queryKey: blogCategoryQueryKeys.lists.filtered(filters),
    queryFn: () => getBlogCategories(filters),
  })
}

export { useBlogCategory, useBlogCategories }
