/* eslint-disable no-unused-vars */
import type { OrderStatus } from '@prisma/client'

const UNKNOWN_ADDRESS_MESSAGE = 'The shipping address is unknown.'

enum PROFILE_TABS {
  ACCOUNT = 'account',
  ORDER = 'order',
  FAVORITE = 'favorite',
  PROFILE = 'profile',
  ADDRESS = 'address',
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

const AFFILIATE_CONFIG = {
  THRESHOLD_AMOUNT: 10000,
  HIGH_COMMISSION_RATE: 0.1,
  LOW_COMMISSION_RATE: 0.05,
} as const

export {
  PROFILE_TABS,
  UNKNOWN_ADDRESS_MESSAGE,
  ORDER_STATUS_LABELS,
  ACTIVE_ORDER_STATUS,
  ORDER_STATUS_FLOW,
  ORDER_STEPS,
  ORDER_STEPS_ALL,
  SHIPPING_PROVIDERS,
  AFFILIATE_CONFIG,
}
