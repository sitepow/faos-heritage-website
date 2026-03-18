'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createProductLocalization,
  updateProductLocalization,
  deleteProductLocalization,
} from './action'
import { productLocaleQueryKeys } from './query-key'

const useProductLocaleMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createProductLocalization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productLocaleQueryKeys.all })
    },
  })

  const update = useMutation({
    mutationFn: updateProductLocalization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productLocaleQueryKeys.all })
    },
  })

  const remove = useMutation({
    mutationFn: deleteProductLocalization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productLocaleQueryKeys.all })
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

export { useProductLocaleMutation }
