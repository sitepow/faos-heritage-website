import type { GetAddressResult } from '@/app/(main)/account/actions/address'
import type { OrderStatus } from '@prisma/client'

import { ORDER_ALL_STATUS } from './const'

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
  if (!address) return 'ไม่ทราบที่อยู่จัดส่งสินค้า'

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
    name ? `ชื่อสำหรับจัดส่ง. ${name}` : null,
    addr ? `บ้านเลขที่ ${addr}` : null,
    subDistrict ? `ตำบล ${subDistrict}` : null,
    district ? `อำเภอ ${district}` : null,
    province ? `จังหวัด ${province}` : null,
    country ? `ประเทศ ${country}` : null,
    postalCode ? `รหัสไปรษณีย์ ${postalCode}` : null,
    phone ? `โทร ${phone}` : null,
  ]
    .filter(Boolean)
    .join(' ')

  return full
}

const getOrderStatus = (key: OrderStatus) => ORDER_ALL_STATUS[key] ?? key

export {
  createSlug,
  getFooter,
  getIdFromSlug,
  removeEmptyField,
  getFullAddress,
  getOrderStatus,
}
