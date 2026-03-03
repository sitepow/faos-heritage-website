'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { upsertPostLocale, deletePostLocale } from './post-localization.action'
import { postLocaleKeys } from './post-localization.query-key'

const usePostLocaleMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: upsert, isPending: isUpserting } = useMutation({
    mutationFn: upsertPostLocale,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postLocaleKeys.all,
      })
    },
  })

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: deletePostLocale,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postLocaleKeys.all,
      })
    },
  })

  return { upsert, remove, isUpserting, isDeleting }
}

export { usePostLocaleMutation }
