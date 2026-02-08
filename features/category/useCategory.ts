'use client'

import { useQuery } from '@tanstack/react-query'

import { getCategories, getCategory } from './category.action'
import { categoryQueryKeys } from './category.query-key'

const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: categoryQueryKeys.details.byId(categoryId!),
    queryFn: () => getCategory(categoryId!),
  })
}

const useCategories = () => {
  return useQuery({
    queryKey: categoryQueryKeys.lists.all(),
    queryFn: getCategories,
  })
}

export { useCategory, useCategories }
