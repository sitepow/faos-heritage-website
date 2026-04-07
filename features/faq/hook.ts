'use client'

import { useQuery } from '@tanstack/react-query'

import { getFaqs, getFaqBySlug } from './action'
import { faqQueryKeys } from './query-key'

const useFaqs = (locale?: string) => {
  return useQuery({
    queryKey: faqQueryKeys.lists.filtered({ locale }),
    queryFn: () => getFaqs(locale),
  })
}

const useFaq = (slug: string, locale?: string) => {
  return useQuery({
    queryKey: faqQueryKeys.details.bySlug(slug, locale),
    queryFn: () => getFaqBySlug(slug, locale),
    enabled: !!slug,
  })
}

export { useFaqs, useFaq }
