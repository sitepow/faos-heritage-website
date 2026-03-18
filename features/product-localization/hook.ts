'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getProductLocalizations,
  getProductLocalization,
  getProductLocaleStat,
} from './action'
import { productLocaleQueryKeys } from './query-key'

const useProductLocales = (productId: string) => {
  return useQuery({
    queryKey: productLocaleQueryKeys.lists.byProductId(productId),
    queryFn: () => getProductLocalizations(productId),
    enabled: !!productId,
  })
}

const useProductLocale = (id: string | null) => {
  return useQuery({
    queryKey: productLocaleQueryKeys.details.byId(id || ''),
    queryFn: () => getProductLocalization(id || ''),
    enabled: !!id,
  })
}

const useProductLocaleStat = (productId: string) => {
  return useQuery({
    queryKey: productLocaleQueryKeys.stats(productId),
    queryFn: () => getProductLocaleStat(productId),
    enabled: !!productId,
  })
}

export { useProductLocales, useProductLocale, useProductLocaleStat }
