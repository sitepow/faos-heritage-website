'use client'

import { useQuery } from '@tanstack/react-query'

import { getTags, getTag, getTagStat } from './tag.action'
import { tagQueryKeys } from './tag.query-key'

const useTags = (locale?: string) => {
  return useQuery({
    queryKey: [...tagQueryKeys.lists(), locale],
    queryFn: () => getTags(locale),
  })
}

const useTag = (tagId: string, locale?: string) => {
  return useQuery({
    queryKey: tagQueryKeys.byId(tagId),
    queryFn: () => getTag(tagId, locale),
    enabled: !!tagId,
  })
}

const useTagStat = () => {
  return useQuery({
    queryKey: tagQueryKeys.stats(),
    queryFn: () => getTagStat(),
  })
}

export { useTags, useTag, useTagStat }
