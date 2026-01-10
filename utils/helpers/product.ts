import type { ProductUnit } from '@prisma/client'

import { PRODUCT_UNIT } from '../constants/product'

export const getProductUnit = (key: ProductUnit) => PRODUCT_UNIT[key] ?? key

interface Variant {
  price?: number
  stockQuantity?: number
}

export const getVariantPriceStockMinMax = (
  variants: Variant[] | null | undefined,
) => {
  if (!variants?.length) {
    return {
      priceMin: null,
      priceMax: null,
      stockMin: null,
      stockMax: null,
    }
  }

  let priceMin: number | null = null
  let priceMax: number | null = null
  let stockMin: number | null = null
  let stockMax: number | null = null

  variants.forEach(({ price, stockQuantity }) => {
    if (price != null) {
      priceMin = priceMin == null ? price : Math.min(priceMin, price)
      priceMax = priceMax == null ? price : Math.max(priceMax, price)
    }

    if (stockQuantity != null) {
      stockMin =
        stockMin == null ? stockQuantity : Math.min(stockMin, stockQuantity)
      stockMax =
        stockMax == null ? stockQuantity : Math.max(stockMax, stockQuantity)
    }
  })

  return { priceMin, priceMax, stockMin, stockMax }
}

export const checkOutOfStock = ({
  stockMin,
  stockMax,
  stockQuantity,
}: {
  stockMin: number | null
  stockMax: number | null
  stockQuantity: number | null
}) =>
  stockMin != null || stockMax != null
    ? !((stockMin ?? 0) > 0 || (stockMax ?? 0) > 0)
    : (stockQuantity ?? 0) <= 0
