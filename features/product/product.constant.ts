import { ProductUnit } from '@prisma/client'

const PRODUCT_UNIT_TH_LABELS: Record<ProductUnit, string> = {
  [ProductUnit.PIECE]: 'ชิ้น',
  [ProductUnit.ITEM]: 'รายการ',
  [ProductUnit.SET]: 'ชุด',
  [ProductUnit.BOX]: 'กล่อง',
  [ProductUnit.PACK]: 'แพ็ก',
  [ProductUnit.BAG]: 'ถุง',
  [ProductUnit.BOTTLE]: 'ขวด',
  [ProductUnit.CAN]: 'กระป๋อง',
  [ProductUnit.KG]: 'กิโลกรัม',
  [ProductUnit.G]: 'กรัม',
  [ProductUnit.L]: 'ลิตร',
  [ProductUnit.ML]: 'มิลลิลิตร',
  [ProductUnit.PAIR]: 'คู่',
  [ProductUnit.ROLL]: 'ม้วน',
  [ProductUnit.SHEET]: 'แผ่น',
  [ProductUnit.UNIT]: 'หน่วย',
  [ProductUnit.CAR]: 'คัน',
  [ProductUnit.HOUSE]: 'หลัง',
}

export { PRODUCT_UNIT_TH_LABELS }
