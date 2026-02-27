'use client'

import { useQuery } from '@tanstack/react-query'

import { getVariants, getVariant } from './product-variant.action'
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

export { useProductVariant, useProductVariants }
