'use client'

import { useQuery } from '@tanstack/react-query'

import { getPostLocales, getPostLocale, getPostLocaleStat } from './action'
import { postLocaleKeys } from './query-key'

const usePostLocale = (id: string) => {
  return useQuery({
    queryKey: postLocaleKeys.details.byId(id),
    queryFn: () => getPostLocale(id),
    enabled: !!id,
  })
}

const usePostLocales = (postId: string) => {
  return useQuery({
    queryKey: postLocaleKeys.lists.byPost(postId),
    queryFn: () => getPostLocales(postId),
    enabled: !!postId,
  })
}

const usePostLocaleStat = (postId: string) => {
  return useQuery({
    queryKey: postLocaleKeys.stats.byPost(postId),
    queryFn: () => getPostLocaleStat(postId),
    enabled: !!postId,
  })
}

export { usePostLocale, usePostLocales, usePostLocaleStat }
