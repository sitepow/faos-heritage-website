import type { OrderStatus } from '@prisma/client'

const SORT_MAP = {
  newest: {
    field: 'createdAt',
    order: 'desc',
    label: 'สินค้า (ใหม่-เก่า)',
  },
  oldest: {
    field: 'createdAt',
    order: 'asc',
    label: 'สินค้า (เก่า-ใหม่)',
  },
  price_low: {
    field: 'price',
    order: 'asc',
    label: 'ราคา (น้อย-มาก)',
  },
  price_high: {
    field: 'price',
    order: 'desc',
    label: 'ราคา (มาก-น้อย)',
  },
  stock_low: {
    field: 'stockQuantity',
    order: 'asc',
    label: 'สต็อก (น้อย-มาก)',
  },
  stock_high: {
    field: 'stockQuantity',
    order: 'desc',
    label: 'สต็อก (มาก-น้อย)',
  },
} as const

enum ACCOUNT_TABS {
  ACCOUNT = 'account',
  ORDER = 'order',
  FAVORITE = 'favorite',
  PROFILE = 'profile',
  ADDRESS = 'address',
}

const ORDER_ALL_STATUS: Record<OrderStatus, string> = {
  PENDING: 'รอชำระเงิน',
  PAID: 'ชำระเงินแล้ว',
  PROCESSING: 'จัดเตรียมสินค้า',
  DELIVERED: 'จัดส่งสำเร็จ',
  CANCELLED: 'ยกเลิกสินค้า',
  REFUNDED: 'คืนสินค้า',
}

const ORDER_STATUS: Partial<Record<OrderStatus, string>> = {
  PENDING: ORDER_ALL_STATUS.PENDING,
  PAID: ORDER_ALL_STATUS.PAID,
  PROCESSING: ORDER_ALL_STATUS.PROCESSING,
  DELIVERED: ORDER_ALL_STATUS.DELIVERED,
}

const ORDER_STEPS = Object.entries(ORDER_STATUS) as [OrderStatus, string][]

export { ACCOUNT_TABS, SORT_MAP, ORDER_STATUS, ORDER_ALL_STATUS, ORDER_STEPS }
