'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getVariants,
  getVariant,
  getVariantStat,
} from './product-variant.action'
import { productVariantQueryKeys } from './product-variant.query-key'

const useProductVariants = (productId: string) => {
  return useQuery({
    queryKey: productVariantQueryKeys.lists.byProductId(productId),
    queryFn: () => getVariants(productId),
    enabled: !!productId,
  })
}

const useProductVariant = (variantId: string | null) => {
  return useQuery({
    queryKey: productVariantQueryKeys.details.byId(variantId || ''),
    queryFn: () => getVariant(variantId || ''),
    enabled: !!variantId,
  })
}

const useProductVariantStat = (productId: string) => {
  return useQuery({
    queryKey: productVariantQueryKeys.stats(productId),
    queryFn: () => getVariantStat(productId),
    enabled: !!productId,
  })
}

export { useProductVariant, useProductVariants, useProductVariantStat }
