/* eslint-disable no-unused-vars */
import path from 'path'

import type { AppLocale } from '@/app/store'
import type { OrderStatus, ProductUnit } from '@prisma/client'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads')
const UPLOAD_URL_PREFIX = '/uploads'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

const QUERY_STALE_TIME = 5 * MINUTE
const QUERY_GC_TIME = 30 * MINUTE

const BRAND_COLORS = {
  primary: '#ba8c25',
}

enum ACCOUNT_TAB {
  ACCOUNT = 'account',
  ORDER = 'order',
  FAVORITE = 'favorite',
  PROFILE = 'profile',
  ADDRESS = 'address',
}

interface NavItem {
  key: string
  label: string
  href: string
}

type CountryItem = {
  code: string
  name: string
}

const DISABLE_SEO_CONFIG = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },
}

const ADMIN_NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'users', label: 'Users', href: '/dashboard/user' },
  { key: 'products', label: 'Products', href: '/dashboard/product' },
  { key: 'orders', label: 'Orders', href: '/dashboard/order' },
] as const satisfies readonly NavItem[]

const IMAGE_FALLBACK = {
  OG: `${process.env.NEXT_PUBLIC_APP_URL}/images/faos-olive-tree.jpg`,
  EMPTY: '/images/no-image.jpg',
}

const PAGINATION = {
  ITEMS_PER_PAGE: 8,
}

const BREAKPOINTS = {
  TABLET: '1024px',
}

const IMAGE_ACCEPT_TYPES = ['.png', '.jpg', '.jpeg', '.gif', '.webp']

const ROUTES = {
  PROTECTED: ['/dashboard', '/cart'],
  AUTH: ['/login', '/register'],
}

const COUNTRY_CONFIG = {
  TH: {
    name: 'Thailand',
    currency: 'THB',
    locale: 'th-TH',
  },
  US: {
    name: 'United States',
    currency: 'USD',
    locale: 'en-US',
  },
  GR: {
    name: 'Greece',
    currency: 'EUR',
    locale: 'el-GR',
  },
  IT: {
    name: 'Italy',
    currency: 'EUR',
    locale: 'it-IT',
  },
  NL: {
    name: 'Netherlands',
    currency: 'EUR',
    locale: 'nl-NL',
  },
  MY: {
    name: 'Malaysia',
    currency: 'MYR',
    locale: 'ms-MY',
  },
  SG: {
    name: 'Singapore',
    currency: 'SGD',
    locale: 'en-SG',
  },
  JP: {
    name: 'Japan',
    currency: 'JPY',
    locale: 'ja-JP',
  },
  CN: {
    name: 'China',
    currency: 'CNY',
    locale: 'zh-CN',
  },
  IS: {
    name: 'Iceland',
    currency: 'ISK',
    locale: 'is-IS',
  },
  VN: {
    name: 'Vietnam',
    currency: 'VND',
    locale: 'vi-VN',
  },
  ID: {
    name: 'Indonesia',
    currency: 'IDR',
    locale: 'id-ID',
  },
} as const

const COUNTRIES: CountryItem[] = Object.entries(COUNTRY_CONFIG).map(
  ([code, { name }]) => ({ code, name }),
)

const DEFAULT_APP_LOCALE = 'th'
const DEFAULT_CURRENCY_CODE = 'THB' as const

const CURRENCY = {
  DEFAULT_CODE: DEFAULT_CURRENCY_CODE,
  DEFAULT_LOCALE: 'th-TH',
  EXCHANGE_API_THB: `https://open.er-api.com/v6/latest/${DEFAULT_CURRENCY_CODE}`,
  CACHE_TTL: 15 * MINUTE,
} as const

const CURRENCY_LOCALE_MAP = Object.entries(COUNTRY_CONFIG).map(
  ([country, { currency, locale }]) => ({
    country,
    currency,
    locale,
  }),
)

const SUPPORTED_APP_LOCALES = Array.from(
  new Set(CURRENCY_LOCALE_MAP.map((i) => i.country.toLowerCase())),
) as readonly string[]

const DEFAULT_COUNTRY_CODE = DEFAULT_APP_LOCALE.toUpperCase()
const DEFAULT_COUNTRY =
  COUNTRY_CONFIG[DEFAULT_COUNTRY_CODE as keyof typeof COUNTRY_CONFIG]

const DEFAULT_LOCALE: AppLocale = {
  country: DEFAULT_COUNTRY_CODE,
  currency: CURRENCY.DEFAULT_CODE,
  locale: CURRENCY.DEFAULT_LOCALE,
  name: DEFAULT_COUNTRY?.name ?? 'Thailand',
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Order Created',
  PAID: 'Payment Completed',
  PROCESSING: 'Preparing Order',
  DELIVERED: 'Shipped',
  CANCELLED: 'Order Cancelled',
  REFUNDED: 'Refunded / Order Cancelled',
}

const ACTIVE_ORDER_STATUS = {
  PENDING: ORDER_STATUS_LABELS.PENDING,
  PAID: ORDER_STATUS_LABELS.PAID,
  PROCESSING: ORDER_STATUS_LABELS.PROCESSING,
  DELIVERED: ORDER_STATUS_LABELS.DELIVERED,
} satisfies Partial<Record<OrderStatus, string>>

const ORDER_STATUS_FLOW: Record<OrderStatus, number> = {
  PENDING: 1,
  PAID: 2,
  PROCESSING: 3,
  DELIVERED: 4,
  CANCELLED: 99,
  REFUNDED: 100,
}

const ORDER_STEPS = Object.entries(ACTIVE_ORDER_STATUS) as [
  OrderStatus,
  string,
][]

const ORDER_STEPS_ALL = Object.entries(ORDER_STATUS_LABELS) as [
  OrderStatus,
  string,
][]

const SORT_OPTIONS = {
  newest: { field: 'createdAt', order: 'desc', label: 'Newest first' },
  oldest: { field: 'createdAt', order: 'asc', label: 'Oldest first' },
  price_low: { field: 'price', order: 'asc', label: 'Price: Low to High' },
  price_high: { field: 'price', order: 'desc', label: 'Price: High to Low' },
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

const PRODUCT_UNIT_LABELS: Record<ProductUnit, string> = {
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

const PRODUCT_UNITS = Object.entries(PRODUCT_UNIT_LABELS) as [
  ProductUnit,
  string,
][]

const SHIPPING_PROVIDERS = [
  {
    key: 'kex',
    label: 'KEX Express',
    url: 'https://th.kex-express.com',
    image: '/images/shipping-providers/kex.png',
    placeholder: 'EX123456789TH',
  },
  {
    key: 'flash',
    label: 'Flash Express',
    url: 'https://www.flashexpress.co.th',
    image: '/images/shipping-providers/flash.png',
    placeholder: 'TH1234567890',
  },
  {
    key: 'jt',
    label: 'J&T Express',
    url: 'https://www.jtexpress.co.th',
    image: '/images/shipping-providers/j&t.png',
    placeholder: '821234567890',
  },
  {
    key: 'ninja',
    label: 'Ninja Van',
    url: 'https://www.ninjavan.co',
    image: '/images/shipping-providers/ninja.png',
    placeholder: 'NVTH123456789',
  },
  {
    key: 'best',
    label: 'Best Express',
    url: 'https://www.best-inc.co.th',
    image: '/images/shipping-providers/best.png',
    placeholder: 'BE1234567890',
  },
  {
    key: 'scg',
    label: 'SCG Express',
    url: 'https://www.scgexpress.co.th',
    image: '/images/shipping-providers/scg.png',
    placeholder: 'SCG123456789',
  },
  {
    key: 'spx',
    label: 'Shopee Express',
    url: 'https://spx.co.th',
    image: '/images/shipping-providers/spx.png',
    placeholder: 'SPXTH123456789',
  },
  {
    key: 'dhl',
    label: 'DHL Express',
    url: 'https://www.dhl.com',
    image: '/images/shipping-providers/dhl.png',
    placeholder: 'JD014600006572000123',
  },
  {
    key: 'fedex',
    label: 'FedEx',
    url: 'https://www.fedex.com',
    image: '/images/shipping-providers/fedx.svg',
    placeholder: '772123456789',
  },
  {
    key: 'ups',
    label: 'UPS',
    url: 'https://www.ups.com',
    image: '/images/shipping-providers/ups.svg',
    placeholder: '1Z999AA10123456784',
  },
  {
    key: 'aramex',
    label: 'Aramex',
    url: 'https://www.aramex.com',
    image: '/images/shipping-providers/aramex.svg',
    placeholder: '42345678901',
  },
  {
    key: 'sf',
    label: 'SF Express',
    url: 'https://www.sf-international.com',
    image: '/images/shipping-providers/sf.svg',
    placeholder: 'SF1234567890123',
  },
  {
    key: 'thailand-post',
    label: 'Thailand Post',
    url: 'https://track.thailandpost.com',
    image: '/images/shipping-providers/thailand-post.png',
    placeholder: 'RR123456789TH',
  },
  {
    key: 'fastship',
    label: 'FastShip',
    url: 'https://fastship.co',
    image: '/images/shipping-providers/fs.svg',
    placeholder: 'FS123456789',
  },
  {
    key: 'sme',
    label: 'SME Shipping',
    url: 'https://smeshipping.com',
    image: '/images/shipping-providers/sme.svg',
    placeholder: 'SME123456789',
  },
  {
    key: 'aye',
    label: 'Aye Cargo',
    url: 'https://www.ayecargo.com',
    image: '/images/shipping-providers/aye.svg',
    placeholder: 'AYE123456789',
  },
  {
    key: 'lidi',
    label: 'LIDI Express',
    url: 'https://www.lidiexpress.com',
    image: '/images/shipping-providers/lidi.svg',
    placeholder: 'LIDI123456789',
  },
  {
    key: 'karton',
    label: 'Karton Express',
    url: 'https://www.karton.express',
    image: '/images/shipping-providers/karton.svg',
    placeholder: 'KRT123456789',
  },
] as const

export type { CountryItem, NavItem }
export { ACCOUNT_TAB }

export {
  BRAND_COLORS,
  PUBLIC_DIR,
  UPLOAD_DIR,
  UPLOAD_URL_PREFIX,
  SECOND,
  MINUTE,
  HOUR,
  QUERY_STALE_TIME,
  QUERY_GC_TIME,
  PRODUCT_UNIT_LABELS,
  ADMIN_NAV_ITEMS,
  DISABLE_SEO_CONFIG,
  IMAGE_FALLBACK,
  PAGINATION,
  BREAKPOINTS,
  IMAGE_ACCEPT_TYPES,
  ROUTES,
  COUNTRIES,
  CURRENCY,
  CURRENCY_LOCALE_MAP,
  SUPPORTED_APP_LOCALES,
  DEFAULT_APP_LOCALE,
  DEFAULT_LOCALE,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_FLOW,
  ORDER_STEPS,
  ORDER_STEPS_ALL,
  SORT_OPTIONS,
  PRODUCT_UNITS,
  SHIPPING_PROVIDERS,
}
