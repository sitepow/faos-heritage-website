'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createShippingCountry,
  updateShippingCountry,
  deleteShippingCountry,
} from './action'
import { shippingQueryKeys } from './query-key'

const useShippingMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createShippingCountry,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: shippingQueryKeys.all }),
  })

  const update = useMutation({
    mutationFn: updateShippingCountry,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: shippingQueryKeys.all }),
  })

  const remove = useMutation({
    mutationFn: deleteShippingCountry,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: shippingQueryKeys.all }),
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

export { useShippingMutation }
