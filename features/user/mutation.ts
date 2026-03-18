'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createUser, updateUser, deleteUser } from './action'
import { userQueryKeys } from './query-key'

const useUserMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  })

  const update = useMutation({
    mutationFn: updateUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  })

  const remove = useMutation({
    mutationFn: deleteUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
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

export { useUserMutation }
