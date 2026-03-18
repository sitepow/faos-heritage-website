'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getCategories,
  getCategoriesAdmin,
  getCategory,
  getCategoryAdmin,
  getCategoryBySlug,
  getCategoryStat,
} from './action'
import { categoryQueryKeys } from './query-key'

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

const useCategoriesAdmin = () => {
  return useQuery({
    queryKey: categoryQueryKeys.lists.all(),
    queryFn: () => getCategoriesAdmin(),
  })
}

const useCategoryAdmin = (id: string) => {
  return useQuery({
    queryKey: categoryQueryKeys.details.byId(id),
    queryFn: () => getCategoryAdmin(id),
    enabled: !!id,
  })
}

const useCategoryStat = () => {
  return useQuery({
    queryKey: categoryQueryKeys.stats(),
    queryFn: () => getCategoryStat(),
  })
}

export {
  useCategoryBySlug,
  useCategory,
  useCategories,
  useCategoriesAdmin,
  useCategoryAdmin,
  useCategoryStat,
}
