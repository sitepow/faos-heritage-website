'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { upsertTagLocale, deleteTagLocale } from './tag-localization.action'
import { tagLocaleKeys } from './tag-localization.query-key'

const useTagLocaleMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: upsert, isPending: isUpserting } = useMutation({
    mutationFn: upsertTagLocale,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tagLocaleKeys.all,
      })
    },
  })

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteTagLocale,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tagLocaleKeys.all,
      })
    },
  })

  return { upsert, remove, isUpserting, isDeleting }
}

export { useTagLocaleMutation }
