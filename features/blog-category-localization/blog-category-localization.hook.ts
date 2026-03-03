'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getBlogCategoryLocale,
  getBlogCategoryLocales,
  getBlogCategoryLocaleStat,
} from './blog-category-localization.action'
import { blogCategoryLocaleKeys } from './blog-category-localization.query-key'

const useBlogCategoryLocale = (id: string) => {
  return useQuery({
    queryKey: blogCategoryLocaleKeys.details.byId(id),
    queryFn: () => getBlogCategoryLocale(id),
    enabled: !!id,
  })
}

const useBlogCategoryLocales = (blogCategoryId: string) => {
  return useQuery({
    queryKey: blogCategoryLocaleKeys.lists.byCategory(blogCategoryId),
    queryFn: () => getBlogCategoryLocales(blogCategoryId),
    enabled: !!blogCategoryId,
  })
}

const useBlogCategoryLocaleStat = (blogCategoryId: string) => {
  return useQuery({
    queryKey: blogCategoryLocaleKeys.stats.byCategory(blogCategoryId),
    queryFn: () => getBlogCategoryLocaleStat(blogCategoryId),
    enabled: !!blogCategoryId,
  })
}

export {
  useBlogCategoryLocale,
  useBlogCategoryLocales,
  useBlogCategoryLocaleStat,
}
