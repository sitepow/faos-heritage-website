import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AddressInput } from './address.schema'

import { createAddress, deleteAddress, updateAddress } from './address.action'
import { addressQueryKeys } from './address.query-key'

const useAddressMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: (data: AddressInput) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.all })
    },
  })

  const update = useMutation({
    mutationFn: (data: AddressInput) => updateAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.all })
    },
  })

  return {
    create: create.mutateAsync,
    update: update.mutateAsync,
    isCreating: create.isPending,
    isUpdating: update.isPending,
  }
}

const useDeleteAddress = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressQueryKeys.all })
    },
  })

  return mutation
}

export { useAddressMutation, useDeleteAddress }
