'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getTagLocales,
  getTagLocale,
  getTagLocaleStat,
} from './tag-localization.action'
import { tagLocaleKeys } from './tag-localization.query-key'

const useTagLocale = (id: string) => {
  return useQuery({
    queryKey: tagLocaleKeys.details.byId(id),
    queryFn: () => getTagLocale(id),
    enabled: !!id,
  })
}

const useTagLocales = (tagId: string) => {
  return useQuery({
    queryKey: tagLocaleKeys.lists.byTag(tagId),
    queryFn: () => getTagLocales(tagId),
    enabled: !!tagId,
  })
}

const useTagLocaleStat = (tagId: string) => {
  return useQuery({
    queryKey: tagLocaleKeys.stats.byTag(tagId),
    queryFn: () => getTagLocaleStat(tagId),
    enabled: !!tagId,
  })
}

export { useTagLocale, useTagLocales, useTagLocaleStat }
