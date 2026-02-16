import type { ProductWithVariants } from '@/features/product/product.types'

import {
  type PriceInfo,
  type ProductVariant,
} from '@/features/product/product.types'

const getProductPriceInfo = (
  product: ProductWithVariants | ProductVariant | null | undefined,
  variantId?: string | null,
): PriceInfo => {
  if (!product) {
    return {
      price: 0,
      originalPrice: 0,
      discountAmount: 0,
      discountPercentage: 0,
      hasDiscount: false,
    }
  }

  const variant =
    variantId && 'variants' in product
      ? product.variants?.find((v) => v.id === variantId)
      : null

  const originalPrice = Number(variant?.price ?? product.price ?? 0)

  const price = Number(variant?.salePrice ?? product.salePrice ?? originalPrice)

  const discountAmount = originalPrice - price
  const hasDiscount = discountAmount > 0
  const discountPercentage =
    hasDiscount && originalPrice > 0
      ? Math.round((discountAmount / originalPrice) * 100)
      : 0

  return {
    price,
    originalPrice,
    discountAmount,
    discountPercentage,
    hasDiscount,
  }
}

export { getProductPriceInfo }
export type { PriceInfo, ProductVariant }
