'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createFaq, updateFaq, deleteFaq } from './action'
import { faqQueryKeys } from './query-key'

const useFaqMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.lists.all() })
    },
  })

  const update = useMutation({
    mutationFn: updateFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.all })
    },
  })

  const remove = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqQueryKeys.all })
    },
  })

  return {
    create: create.mutateAsync,
    isCreating: create.isPending,
    update: update.mutateAsync,
    isUpdating: update.isPending,
    remove: remove.mutateAsync,
    isDeleting: remove.isPending,
  }
}

export { useFaqMutation }
