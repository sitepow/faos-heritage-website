'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getProductLocalizations,
  getProductLocalization,
} from './product-localization.action'
import { productLocaleQueryKeys } from './product-localization.query-key'

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

export { useProductLocales, useProductLocale }
