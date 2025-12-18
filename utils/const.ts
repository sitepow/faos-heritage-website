import type { OrderStatus, ProductUnit } from '@prisma/client'

const ITEM_PER_PAGE = 8

const SORT_MAP = {
  newest: {
    field: 'createdAt',
    order: 'desc',
    label: 'Newest',
  },
  oldest: {
    field: 'createdAt',
    order: 'asc',
    label: 'Oldest',
  },
  price_low: {
    field: 'price',
    order: 'asc',
    label: 'Price: Low to High',
  },
  price_high: {
    field: 'price',
    order: 'desc',
    label: 'Price: High to Low',
  },
  stock_low: {
    field: 'stockQuantity',
    order: 'asc',
    label: 'Stock: Low to High',
  },
  stock_high: {
    field: 'stockQuantity',
    order: 'desc',
    label: 'Stock: High to Low',
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
  PENDING: 'Order Created',
  PAID: 'Payment Completed',
  PROCESSING: 'Preparing Order',
  DELIVERED: 'Shipped',
  CANCELLED: 'Order Cancelled',
  REFUNDED: 'Refunded / Order Cancelled',
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
  PIECE: 'Piece',
  ITEM: 'Item',
  SET: 'Set',
  BOX: 'Box',
  PACK: 'Pack',
  BAG: 'Bag',
  BOTTLE: 'Bottle',
  CAN: 'Can',
  KG: 'Kilogram',
  G: 'Gram',
  L: 'Liter',
  ML: 'Milliliter',
  PAIR: 'Pair',
  ROLL: 'Roll',
  SHEET: 'Sheet',
  UNIT: 'Unit',
  CAR: 'Car',
  HOUSE: 'House',
}

const PRODUCT_UNITS = Object.entries(PRODUCT_UNIT) as [ProductUnit, string][]

const SHIPPING_PROVIDERS = [
  {
    image: '/providers/kex.png',
    value: 'https://th.kex-express.com',
    label: 'KEX Express',
    placeholder: 'EX123456789TH',
  },
  {
    image: '/providers/flash.png',
    value: 'https://www.flashexpress.co.th',
    label: 'Flash Express',
    placeholder: 'TH1234567890',
  },
  {
    image: '/providers/j&t.png',
    value: 'https://www.jtexpress.co.th',
    label: 'J&T Express',
    placeholder: '821234567890',
  },
  {
    image: '/providers/ninja.png',
    value: 'https://www.ninjavan.co',
    label: 'Ninja Van',
    placeholder: 'NVTH123456789',
  },
  {
    image: '/providers/best.png',
    value: 'https://www.best-inc.co.th',
    label: 'Best Express',
    placeholder: 'BE1234567890',
  },
  {
    image: '/providers/scg.png',
    value: 'https://www.scgexpress.co.th',
    label: 'SCG Express',
    placeholder: 'SCG123456789',
  },
  {
    image: '/providers/spx.png',
    value: 'https://spx.co.th',
    label: 'Shopee Express',
    placeholder: 'SPXTH123456789',
  },
  {
    image: '/providers/dhl.png',
    value: 'https://www.dhl.com',
    label: 'DHL Express',
    placeholder: 'JD014600006572000123',
  },
  {
    image: '/providers/fedx.svg',
    value: 'https://www.fedex.com',
    label: 'FedEx',
    placeholder: '772123456789',
  },
  {
    image: '/providers/ups.svg',
    value: 'https://www.ups.com',
    label: 'UPS',
    placeholder: '1Z999AA10123456784',
  },
  {
    image: '/providers/aramex.svg',
    value: 'https://www.aramex.com',
    label: 'Aramex',
    placeholder: '42345678901',
  },
  {
    image: '/providers/sf.svg',
    value: 'https://www.sf-international.com',
    label: 'SF Express',
    placeholder: 'SF1234567890123',
  },
  {
    image: '/providers/thailand-post.svg',
    value: 'https://track.thailandpost.com',
    label: 'Thailand Post',
    placeholder: 'RR123456789TH',
  },
  {
    image: '/providers/fs.svg',
    value: 'https://fastship.co',
    label: 'FastShip',
    placeholder: 'FS123456789',
  },
  {
    image: '/providers/sme.svg',
    value: 'https://smeshipping.com',
    label: 'SME Shipping',
    placeholder: 'SME123456789',
  },
  {
    image: '/providers/aye.svg',
    value: 'https://www.ayecargo.com',
    label: 'Aye Cargo',
    placeholder: 'AYE123456789',
  },
  {
    image: '/providers/lidi.svg',
    value: 'https://www.lidiexpress.com',
    label: 'LIDI Express',
    placeholder: 'LIDI123456789',
  },
  {
    image: '/providers/karton.svg',
    value: 'https://www.karton.express',
    label: 'Karton Express',
    placeholder: 'KRT123456789',
  },
]

const PROTECTED_PATHS = ['/dashboard', '/cart']
const AUTH_PATHS = ['/login', '/register']

export {
  ACCOUNT_TAB,
  SORT_MAP,
  ORDER_STATUS,
  ORDER_ALL_STATUS,
  ORDER_STEPS,
  ORDER_STEPS_ALL,
  ORDER_STATUS_FLOW,
  PRODUCT_UNIT,
  PRODUCT_UNITS,
  SHIPPING_PROVIDERS,
  PROTECTED_PATHS,
  AUTH_PATHS,
  ITEM_PER_PAGE,
}
