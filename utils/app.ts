/* eslint-disable no-unused-vars */
import { OrderStatus } from '@prisma/client'
import slugify from '@sindresorhus/slugify'

import type { GetProductResult } from '@/app/[locale]/(main)/products/action'
import type { GetAddressResult } from '@/features/address/address.action'
import type { SharedSelection } from '@heroui/system'
import type { Prisma, ProductUnit } from '@prisma/client'

import { decimalToNumber } from './number'

import {
  IMAGE_FALLBACK,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  PRODUCT_UNIT_LABELS,
} from '@/constants/app'

const UNKNOWN_ADDRESS_MESSAGE = 'The shipping address is unknown.'

const formatFullAddress = (address?: GetAddressResult | null): string => {
  if (!address) return UNKNOWN_ADDRESS_MESSAGE

  const {
    name,
    address: street,
    subDistrict,
    district,
    province,
    postalCode,
    country,
    phone,
  } = address

  const addressParts = [
    name,
    street,
    subDistrict,
    district,
    province,
    postalCode,
    country,
  ].filter(Boolean)

  const formatted = addressParts.join(', ')

  return phone ? `${formatted}. Phone: ${phone}` : formatted
}

/**
 * Remove null / undefined / empty string fields from object
 */
const omitEmptyFields = <T extends Record<string, unknown>>(
  value: T | null | undefined,
): Partial<T> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([, v]) => v !== null && v !== undefined && v !== '',
    ),
  ) as Partial<T>
}

const resolveOrderStatusLabel = (status: OrderStatus): string =>
  ORDER_STATUS_LABELS[status] ?? status

const canTransitionOrderStatus = (
  current: OrderStatus,
  next: OrderStatus,
): boolean => {
  if (current === next) return false

  if (next === OrderStatus.CANCELLED) {
    return current === OrderStatus.PENDING
  }

  if (next === OrderStatus.REFUNDED) {
    return current === OrderStatus.DELIVERED
  }

  return ORDER_STATUS_FLOW[next] === ORDER_STATUS_FLOW[current] + 1
}

const resolveProductUnitLabel = (unit: ProductUnit): string =>
  PRODUCT_UNIT_LABELS[unit] ?? unit

interface VariantPriceStock {
  price?: number
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
    (acc, { price, stockQuantity }) => {
      if (price != null) {
        acc.priceMin =
          acc.priceMin == null ? price : Math.min(acc.priceMin, price)
        acc.priceMax =
          acc.priceMax == null ? price : Math.max(acc.priceMax, price)
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

const toStripeMinorUnit = (amount: number, currency: string): number => {
  const code = currency.toUpperCase()

  if (['JPY', 'VND', 'KRW'].includes(code)) {
    return Math.round(amount)
  }

  if (code === 'ISK') {
    return Math.round(amount) * 100
  }

  return Math.round(amount * 100)
}

const normalizeEmail = (email?: string | null) =>
  email?.trim().toLowerCase() ?? null

const getBackgroundStyle = (image: string) => {
  return {
    backgroundImage: `
      linear-gradient(
        to right,
        rgba(0,0,0,0.8),
        rgba(0,0,0,0.4)
      ),
      url(${image})
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

const getSingleKey = <T extends string>(keys: SharedSelection) => {
  if (keys === 'all') return undefined
  return Array.from(keys)[0] as T | undefined
}

const resolveProductImages = (product: GetProductResult) => {
  const images = product?.images ?? []

  const primary = images.find((img) => img.isPrimary) ?? images[0] ?? null

  const hover = images.find((img) => !img.isPrimary) ?? primary

  return {
    primarySrc: primary?.url ?? IMAGE_FALLBACK.EMPTY,
    hoverSrc: hover?.url ?? IMAGE_FALLBACK.EMPTY,
  }
}

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
  formatFullAddress,
  omitEmptyFields,
  resolveOrderStatusLabel,
  canTransitionOrderStatus,
  resolveProductUnitLabel,
  calculateVariantRange,
  checkIsOutOfStock,
  resolveRangeDisplayValue,
  generateSlugWithId,
  extractIdFromSlug,
  extractNameFromSlug,
  toStripeMinorUnit,
  normalizeEmail,
  getBackgroundStyle,
  getSingleKey,
  resolveProductImages,
  formatStat,
}
