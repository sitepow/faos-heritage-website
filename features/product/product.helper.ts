/* eslint-disable @typescript-eslint/no-explicit-any */

import { calculateVariantRange } from '@/utils'
import { applyLocalization } from '@/utils/localization'

const transformProduct = <T extends Record<string, any>>(product: T | null) => {
  if (!product) {
    return null
  }

  const localizedProduct = applyLocalization(product) as T

  const { priceMin, priceMax, stockMin, stockMax } = calculateVariantRange(
    localizedProduct.variants ?? [],
  )

  const hasAnyDiscount = localizedProduct.variants?.some(
    (v: any) =>
      v.salePrice !== null &&
      v.salePrice !== undefined &&
      v.salePrice < v.price,
  )

  return {
    ...localizedProduct,
    priceMin,
    priceMax,
    stockMin,
    stockMax,
    hasAnyDiscount,
  }
}

export { transformProduct }
