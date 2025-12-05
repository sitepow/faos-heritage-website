const SORT_MAP = {
  newest: {
    field: 'createdAt',
    order: 'desc',
    label: 'ใหม่ล่าสุด',
  },
  oldest: {
    field: 'createdAt',
    order: 'asc',
    label: 'เก่าสุด',
  },
  price_low: {
    field: 'price',
    order: 'asc',
    label: 'ราคาต่ำไปสูง',
  },
  price_high: {
    field: 'price',
    order: 'desc',
    label: 'ราคาสูงไปต่ำ',
  },
  stock_low: {
    field: 'stockQuantity',
    order: 'asc',
    label: 'สต็อกน้อยไปมาก',
  },
  stock_high: {
    field: 'stockQuantity',
    order: 'desc',
    label: 'สต็อกมากไปน้อย',
  },
} as const

enum ACCOUNT_TABS {
  ACCOUNT = 'account',
  ORDER = 'order',
  FAVORITE = 'favorite',
  PROFILE = 'profile',
  ADDRESS = 'address',
}

export { ACCOUNT_TABS, SORT_MAP }
