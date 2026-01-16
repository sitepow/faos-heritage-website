import type { ProductUnit } from '@prisma/client'

export const SORT_ITEMS = {
  newest: {
    field: 'createdAt',
    order: 'desc',
    label: 'Newest first',
  },
  oldest: {
    field: 'createdAt',
    order: 'asc',
    label: 'Oldest first',
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

export const PRODUCT_UNIT: Record<ProductUnit, string> = {
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

export const PRODUCT_UNITS = Object.entries(PRODUCT_UNIT) as [
  ProductUnit,
  string,
][]
