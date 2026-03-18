'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { upsertCategoryLocale, deleteCategoryLocale } from './action'
import { categoryLocaleKeys } from './query-key'

const useCategoryLocaleMutation = (categoryId: string) => {
  const queryClient = useQueryClient()

  const { mutateAsync: upsert, isPending: isUpserting } = useMutation({
    mutationFn: upsertCategoryLocale,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryLocaleKeys.lists.byCategory(categoryId),
      })
    },
  })

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategoryLocale,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryLocaleKeys.lists.byCategory(categoryId),
      })
    },
  })

  return { upsert, remove, isUpserting, isDeleting }
}

export { useCategoryLocaleMutation }
