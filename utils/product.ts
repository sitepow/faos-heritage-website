/* eslint-disable no-unused-vars */
import slugify from '@sindresorhus/slugify'

import type { Prisma, ProductUnit } from '@prisma/client'

import { decimalToNumber } from './number'

import { PRODUCT_UNIT_LABELS } from '@/constants'

const resolveProductUnitLabel = (unit: ProductUnit): string =>
  PRODUCT_UNIT_LABELS[unit] ?? unit

interface VariantPriceStock {
  price?: number
  salePrice?: number | null
  stockQuantity?: number
}

const calculateVariantRange = (variants?: VariantPriceStock[] | null) => {
  if (!variants?.length) {
    return {
      priceMin: null,
      priceMax: null,
      stockMin: null,
      stockMax: null,
    }
  }

  return variants.reduce(
    (acc, { price, salePrice, stockQuantity }) => {
      const currentPrice =
        salePrice !== null && salePrice !== undefined ? salePrice : price

      if (currentPrice != null) {
        acc.priceMin =
          acc.priceMin == null
            ? currentPrice
            : Math.min(acc.priceMin, currentPrice)
        acc.priceMax =
          acc.priceMax == null
            ? currentPrice
            : Math.max(acc.priceMax, currentPrice)
      }

      if (stockQuantity != null) {
        acc.stockMin =
          acc.stockMin == null
            ? stockQuantity
            : Math.min(acc.stockMin, stockQuantity)
        acc.stockMax =
          acc.stockMax == null
            ? stockQuantity
            : Math.max(acc.stockMax, stockQuantity)
      }

      return acc
    },
    {
      priceMin: null as number | null,
      priceMax: null as number | null,
      stockMin: null as number | null,
      stockMax: null as number | null,
    },
  )
}

const checkIsOutOfStock = ({
  stockMin,
  stockMax,
  stockQuantity,
}: {
  stockMin?: number | null
  stockMax?: number | null
  stockQuantity?: number | null
}): boolean => {
  if (stockMin != null || stockMax != null) {
    return !((stockMin ?? 0) > 0 || (stockMax ?? 0) > 0)
  }

  return (stockQuantity ?? 0) <= 0
}

type NullableNumber = number | null | undefined

interface RangeDisplayInput {
  min?: NullableNumber
  max?: NullableNumber
  fallback?: NullableNumber
}

const resolveRangeDisplayValue = <T>(
  input: RangeDisplayInput,
  formatter: {
    single: (value: number) => T
    range: (min: number, max: number) => T
  },
): T | null => {
  const { min, max, fallback } = input

  if (typeof min === 'number' && typeof max === 'number') {
    return min === max ? formatter.single(min) : formatter.range(min, max)
  }

  if (typeof fallback === 'number') {
    return formatter.single(fallback)
  }

  return null
}

const generateSlugWithId = (name: string, id: string | number) => {
  if (!name || !id) {
    return ''
  }

  return `${slugify(name, { lowercase: true })}-${id}`
}

const extractIdFromSlug = (slug: string): string => slug.split('-').pop() ?? ''

const extractNameFromSlug = (slug: string): string =>
  slug.split('-').slice(0, -1).join(' ')

interface FormatStatParams {
  name: string
  value: Prisma.Decimal | Number | null
  isCurrency?: Boolean
}

const formatStat = ({ name, value, isCurrency = false }: FormatStatParams) => ({
  name,
  value: value ? decimalToNumber(value) : 0,
  isCurrency,
})

export {
  resolveProductUnitLabel,
  calculateVariantRange,
  checkIsOutOfStock,
  resolveRangeDisplayValue,
  generateSlugWithId,
  extractIdFromSlug,
  extractNameFromSlug,
  formatStat,
}
