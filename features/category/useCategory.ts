'use client'

import { useQuery } from '@tanstack/react-query'

import { getCategories } from './category.action'
import { categoryQueryKeys } from './category.query-key'

const useCategories = () => {
  return useQuery({
    queryKey: categoryQueryKeys.lists.all(),
    queryFn: getCategories,
  })
}

export { useCategories }
