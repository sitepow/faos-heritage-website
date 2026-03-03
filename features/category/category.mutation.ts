'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from './category.action'
import { categoryQueryKeys } from './category.query-key'

const useCategoryMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
    },
  })

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
    },
  })

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all })
    },
  })

  return { create, update, remove, isCreating, isUpdating, isDeleting }
}

export { useCategoryMutation }
