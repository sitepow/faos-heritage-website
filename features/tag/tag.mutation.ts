'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createTag, deleteTags, updateTag } from './tag.action'
import { tagQueryKeys } from './tag.query-key'

const useTagMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.all })
    },
  })

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: updateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.all })
    },
  })

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteTags,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagQueryKeys.all })
    },
  })

  return {
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
  }
}

export { useTagMutation }
