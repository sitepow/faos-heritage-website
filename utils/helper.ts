import { OrderStatus } from '@prisma/client'

import type { GetAddressResult } from '@/app/(main)/account/actions/address'
import type { ProductUnit } from '@prisma/client'

import { ORDER_ALL_STATUS, ORDER_STATUS_FLOW, PRODUCT_UNIT } from './const'

import { siteConfig } from '@/config/site'

const getFooter = () => {
  return ` Copyright ${new Date().getFullYear()} ${siteConfig.name} - ${siteConfig.title}`
}

const createSlug = (name: string, id: number | string): string => {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `${slug}-${id}`
}

const getIdFromSlug = (slug: string): string => {
  const parts = slug.split('-').filter(Boolean)

  return parts[parts.length - 1] || ''
}

const removeEmptyField = <T extends Record<string, unknown>>(
  obj: T,
): Partial<T> => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return {} as Partial<T>
  }

  const cleanedEntries = Object.entries(obj).filter(([_, value]) => {
    return value != null && value !== ''
  })

  return Object.fromEntries(cleanedEntries) as Partial<T>
}

const getFullAddress = (address: GetAddressResult) => {
  if (!address) return 'The shipping address is unknown.'

  const {
    name,
    address: addr,
    subDistrict,
    district,
    province,
    country,
    postalCode,
    phone,
  } = address

  const full = [
    name ? `Shipping name. ${name}` : null,
    addr ? `House number ${addr}` : null,
    subDistrict ? `district ${subDistrict}` : null,
    district ? `district ${district}` : null,
    province ? `province ${province}` : null,
    country ? `country ${country}` : null,
    postalCode ? `zip code ${postalCode}` : null,
    phone ? `phone ${phone}` : null,
  ]
    .filter(Boolean)
    .join(' ')

  return full
}

const getOrderStatus = (key: OrderStatus) => ORDER_ALL_STATUS[key] ?? key
const getProductUnit = (key: ProductUnit) => PRODUCT_UNIT[key] ?? key

interface Variant {
  price?: number
  stockQuantity?: number
}

const getPriceAndStockMinMaxFromVariants = (
  variants: Variant[] | undefined | null,
) => {
  if (!variants || variants.length === 0) {
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
    if (typeof price === 'number') {
      priceMin = priceMin === null ? price : Math.min(priceMin, price)
      priceMax = priceMax === null ? price : Math.max(priceMax, price)
    }

    if (typeof stockQuantity === 'number') {
      stockMin =
        stockMin === null ? stockQuantity : Math.min(stockMin, stockQuantity)

      stockMax =
        stockMax === null ? stockQuantity : Math.max(stockMax, stockQuantity)
    }
  })

  return {
    priceMin,
    priceMax,
    stockMin,
    stockMax,
  }
}

const canSelectStatus = (current: OrderStatus, next: OrderStatus) => {
  const currentStep = ORDER_STATUS_FLOW[current]
  const nextStep = ORDER_STATUS_FLOW[next]

  if (current === next) return false

  if (next === OrderStatus.CANCELLED) {
    return current === OrderStatus.PENDING
  }

  if (next === OrderStatus.REFUNDED) {
    return current === OrderStatus.DELIVERED
  }

  return nextStep === currentStep + 1
}

const isActivePath = (pathname: string, href: string) => {
  const cleanHref = href.split('?')[0]

  if (cleanHref === '/') {
    return pathname === '/'
  }

  return pathname === cleanHref
}

export {
  createSlug,
  getFooter,
  getIdFromSlug,
  removeEmptyField,
  getFullAddress,
  getOrderStatus,
  getProductUnit,
  getPriceAndStockMinMaxFromVariants,
  canSelectStatus,
  isActivePath,
}
