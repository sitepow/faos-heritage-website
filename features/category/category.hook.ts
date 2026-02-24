'use client'

import { useQuery } from '@tanstack/react-query'

import { getCategories, getCategory } from './category.action'
import { categoryQueryKeys } from './category.query-key'

interface UseCategoryParams {
  categoryId: string
  locale?: string
}

interface UseCategoriesParams {
  locale?: string
}

const useCategory = ({ categoryId, locale }: UseCategoryParams) => {
  return useQuery({
    queryKey: [...categoryQueryKeys.details.byId(categoryId), locale],
    queryFn: () => getCategory(categoryId, locale),
    enabled: !!categoryId,
  })
}

const useCategories = ({ locale }: UseCategoriesParams) => {
  return useQuery({
    queryKey: [...categoryQueryKeys.lists.all(), locale],
    queryFn: () => getCategories(locale),
  })
}

export { useCategory, useCategories }
