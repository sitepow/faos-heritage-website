import { StockMovementType } from '@prisma/client'

const STOCK_MOVEMENT_LABELS: Record<StockMovementType, string> = {
  [StockMovementType.SALE]: 'ขายสินค้า',
  [StockMovementType.RESTOCK]: 'เติมสต็อก',
  [StockMovementType.ADJUSTMENT]: 'ปรับปรุงสต็อก',
  [StockMovementType.RETURN]: 'คืนสินค้า',
  [StockMovementType.WITHDRAWAL]: 'เบิกออก',
  [StockMovementType.TRANSFER]: 'ย้ายของ',
}

export { STOCK_MOVEMENT_LABELS }
