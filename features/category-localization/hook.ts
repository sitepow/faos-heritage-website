'use client'

import { useQuery } from '@tanstack/react-query'

import { getCategoryLocales, getCategoryLocaleStat } from './action'
import { categoryLocaleKeys } from './query-key'

const useCategoryLocales = (categoryId: string) => {
  return useQuery({
    queryKey: categoryLocaleKeys.lists.byCategory(categoryId),
    queryFn: () => getCategoryLocales(categoryId),
    enabled: !!categoryId,
  })
}

const useCategoryLocaleStat = (categoryId: string) => {
  return useQuery({
    queryKey: categoryLocaleKeys.stats.byCategory(categoryId),
    queryFn: () => getCategoryLocaleStat(categoryId),
    enabled: !!categoryId,
  })
}

export { useCategoryLocales, useCategoryLocaleStat }
