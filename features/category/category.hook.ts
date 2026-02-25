'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getCategories,
  getCategory,
  getCategoryBySlug,
} from './category.action'
import { categoryQueryKeys } from './category.query-key'

interface UseCategoryParams {
  categoryId: string
  locale?: string
}

interface UseCategoriesParams {
  locale?: string
}

const useCategoryBySlug = ({
  slug,
  locale,
}: {
  slug: string
  locale?: string
}) => {
  return useQuery({
    queryKey: [...categoryQueryKeys.details.bySlug(slug), locale],
    queryFn: () => getCategoryBySlug(slug, locale),
    enabled: !!slug,
  })
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

export { useCategoryBySlug, useCategory, useCategories }
