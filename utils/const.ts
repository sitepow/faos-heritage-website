import type { OrderStatus, ProductUnit } from '@prisma/client'

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

enum ACCOUNT_TAB {
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
  DELIVERED: 'ส่งให้ขนส่งแล้ว',
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
const ORDER_STEPS_ALL = Object.entries(ORDER_ALL_STATUS) as [
  OrderStatus,
  string,
][]

const ORDER_STATUS_FLOW: Record<OrderStatus, number> = {
  PENDING: 1,
  PAID: 2,
  PROCESSING: 3,
  DELIVERED: 4,
  CANCELLED: 99,
  REFUNDED: 100,
}

const PRODUCT_UNIT: Record<ProductUnit, string> = {
  PIECE: 'ชิ้น',
  ITEM: 'อัน',
  SET: 'ชุด',
  BOX: 'กล่อง',
  PACK: 'แพ็ค',
  BAG: 'ถุง',
  BOTTLE: 'ขวด',
  CAN: 'กระป๋อง',
  KG: 'กิโลกรัม',
  G: 'กรัม',
  L: 'ลิตร',
  ML: 'มิลลิลิตร',
  PAIR: 'คู่',
  ROLL: 'ม้วน',
  SHEET: 'แผ่น',
  UNIT: 'หน่วย',
  CAR: 'คัน',
  HOUSE: 'หลัง',
}

const PRODUCT_UNIT_ALL = Object.entries(PRODUCT_UNIT) as [ProductUnit, string][]

export {
  ACCOUNT_TAB,
  SORT_MAP,
  ORDER_STATUS,
  ORDER_ALL_STATUS,
  ORDER_STEPS,
  ORDER_STEPS_ALL,
  ORDER_STATUS_FLOW,
  PRODUCT_UNIT,
  PRODUCT_UNIT_ALL,
}
