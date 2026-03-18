'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createVariant, updateVariant, deleteVariant } from './action'
import { productVariantQueryKeys } from './query-key'

const useProductVariantMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productVariantQueryKeys.all })
    },
  })

  const update = useMutation({
    mutationFn: updateVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productVariantQueryKeys.all })
    },
  })

  const remove = useMutation({
    mutationFn: deleteVariant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productVariantQueryKeys.all })
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

export { useProductVariantMutation }
