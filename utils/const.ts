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

export { ACCOUNT_TABS, SORT_MAP }
