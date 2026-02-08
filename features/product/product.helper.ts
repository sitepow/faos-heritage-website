/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateVariantRange } from '@/utils'

export type TransformedProductFields = {
  priceMin: number
  priceMax: number
  stockMin: number
  stockMax: number
  name: string
  shortDescription: string | null
  description: string | null
}

const transformProduct = <T extends Record<string, any>>(
  product: T | null,
): (T & TransformedProductFields) | null => {
  if (!product) {
    return null
  }

  const { priceMin, priceMax, stockMin, stockMax } = calculateVariantRange(
    product.variants ?? [],
  )

  const localization = product.localizations?.[0]

  return {
    ...product,
    priceMin,
    priceMax,
    stockMin,
    stockMax,
    name: localization?.name ?? product.name,
    shortDescription:
      localization?.shortDescription ?? product.shortDescription,
    description: localization?.description ?? product.description,
  } as T & TransformedProductFields
}

export { transformProduct }
