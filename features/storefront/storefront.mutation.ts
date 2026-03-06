import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createStorefront,
  deleteStorefront,
  updateStorefront,
} from './storefront.action'
import { storefrontQueryKeys } from './storefront.query-key'
import { type StorefrontInput } from './storefront.schema'
import { useStorefrontStore } from './storefront.store'

const useStorefrontMutation = () => {
  const queryClient = useQueryClient()
  const { closeForm, closeDelete } = useStorefrontStore()

  const create = useMutation({
    mutationFn: (data: StorefrontInput) => createStorefront(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: storefrontQueryKeys.all })
        closeForm()
      }
    },
  })

  const update = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<StorefrontInput>
    }) => updateStorefront(id, data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: storefrontQueryKeys.all })
        closeForm()
      }
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteStorefront(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: storefrontQueryKeys.all })
        closeDelete()
      }
    },
  })

  return {
    createStorefront: create.mutateAsync,
    isCreating: create.isPending,
    updateStorefront: update.mutateAsync,
    isUpdating: update.isPending,
    deleteStorefront: remove.mutateAsync,
    isDeleting: remove.isPending,
  }
}

export { useStorefrontMutation }
