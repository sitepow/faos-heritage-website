import { StockMovementType } from '@prisma/client'
import { z } from 'zod'

const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'กรุณาเลือกสินค้า'),
  variantId: z.string().nullable().optional(),
  quantity: z.number().min(1, 'กรุณาระบุจำนวนอย่างน้อย 1 ชิ้น'),

  type: z.enum(StockMovementType, {
    error: 'กรุณาเลือกประเภทรายการ',
  }),

  location: z.string().min(1, 'กรุณาระบุสถานที่หรือแผนก'),
  note: z.string().nullable().optional().or(z.literal('')),
  reference: z.string().nullable().optional().or(z.literal('')),
})

type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>

export { stockAdjustmentSchema }
export type { StockAdjustmentInput }
