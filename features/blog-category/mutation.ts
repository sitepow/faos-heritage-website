'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { upsertBlogCategory, deleteBlogCategory } from './action'
import { blogCategoryQueryKeys } from './query-key'

const useBlogCategoryMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: upsert, isPending: isUpserting } = useMutation({
    mutationFn: upsertBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogCategoryQueryKeys.all })
    },
  })

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteBlogCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogCategoryQueryKeys.all })
    },
  })

  return {
    create: upsert,
    update: upsert,
    remove,
    isCreating: isUpserting,
    isUpdating: isUpserting,
    isDeleting,
  }
}

export { useBlogCategoryMutation }
