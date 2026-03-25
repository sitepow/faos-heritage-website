'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ContractInput } from './schema'
import type { ContractStatus } from '@prisma/client'

import {
  createContract,
  deleteContract,
  updateContract,
  updateContractStatus,
} from './action'
import { contractQueryKeys } from './query-key'

const useContractMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: contractQueryKeys.all })
    },
  })

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContractInput }) => {
      return updateContract(id, data)
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: contractQueryKeys.all })
    },
  })

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: (id: string | string[]) => deleteContract(id),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: contractQueryKeys.all })
    },
  })

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: ({
        id,
        status,
        storeSignature,
      }: {
        id: string
        status: ContractStatus
        storeSignature?: string
      }) => {
        return updateContractStatus(id, status, storeSignature)
      },
      onSuccess: () => {
        return queryClient.invalidateQueries({
          queryKey: contractQueryKeys.all,
        })
      },
    })

  return {
    create,
    update,
    remove,
    updateStatus,
    isCreating,
    isUpdating,
    isDeleting,
    isUpdatingStatus,
  }
}

export { useContractMutation }
