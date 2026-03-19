'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveStorefrontInventory, transferStorefrontStock } from './action'
import { storefrontInventoryKeys } from './query-key'

import { productQueryKeys } from '@/features/product/query-key'

const useStorefrontInventoryMutation = () => {
  const queryClient = useQueryClient()

  const save = useMutation({
    mutationFn: saveStorefrontInventory,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: storefrontInventoryKeys.all,
      })
    },
  })

  const transfer = useMutation({
    mutationFn: transferStorefrontStock,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: storefrontInventoryKeys.all,
      })
      return queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
  })

  return {
    saveInventory: save.mutateAsync,
    transferStock: transfer.mutateAsync,
    isPending: save.isPending || transfer.isPending,
  }
}

export { useStorefrontInventoryMutation }
