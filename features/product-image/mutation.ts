'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createProductImage,
  updateProductImage,
  deleteProductImage,
} from './action'
import { productImageQueryKeys } from './query-key'

const useProductImageMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createProductImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productImageQueryKeys.all })
    },
  })

  const update = useMutation({
    mutationFn: updateProductImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productImageQueryKeys.all })
    },
  })

  const remove = useMutation({
    mutationFn: deleteProductImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productImageQueryKeys.all })
    },
  })

  return {
    create: create.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
  }
}

export { useProductImageMutation }
