'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  upsertBlogCategoryLocale,
  deleteBlogCategoryLocale,
} from './blog-category-localization.action'
import { blogCategoryLocaleKeys } from './blog-category-localization.query-key'

const useBlogCategoryLocaleMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: upsert, isPending: isUpserting } = useMutation({
    mutationFn: upsertBlogCategoryLocale,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: blogCategoryLocaleKeys.all,
      })
    },
  })

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteBlogCategoryLocale,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: blogCategoryLocaleKeys.all,
      })
    },
  })

  return { upsert, remove, isUpserting, isDeleting }
}

export { useBlogCategoryLocaleMutation }
