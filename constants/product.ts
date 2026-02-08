import type { ProductUnit } from '@prisma/client'

const IMAGE_ACCEPT_TYPES = ['.png', '.jpg', '.jpeg', '.gif', '.webp']

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

export { IMAGE_ACCEPT_TYPES, PRODUCT_UNIT_LABELS, PRODUCT_UNITS }
