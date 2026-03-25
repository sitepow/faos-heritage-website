import { ContractStatus, Currency } from '@prisma/client'
import { z } from 'zod'

const contractItemSchema = z.object({
  productId: z.string().min(1, 'กรุณาเลือกสินค้า'),
  variantId: z.string().optional().nullable(),
  productName: z.string().min(1, 'ชื่อสินค้าห้ามว่าง'),
  variantName: z.string().optional().nullable(),
  quantity: z.number().min(0, 'จำนวนต้องไม่ติดลบ'),
  agreedPrice: z.number().min(0, 'ราคาต้องไม่ติดลบ'),
  subtotal: z.number(),
})

const contractSchema = z.object({
  id: z.string().optional(),
  storefrontId: z.string().min(1, 'กรุณาเลือกหน้าร้าน'),
  status: z
    .enum([
      ContractStatus.DRAFT,
      ContractStatus.PENDING,
      ContractStatus.ACTIVE,
      ContractStatus.EXPIRED,
      ContractStatus.TERMINATED,
      ContractStatus.ARCHIVED,
    ])
    .default(ContractStatus.DRAFT),
  startDate: z.coerce.date().default(() => new Date()),
  endDate: z.coerce.date().optional().nullable(),
  totalAmount: z.number().min(0),
  currency: z.enum(Currency).default(Currency.THB),
  items: z
    .array(contractItemSchema)
    .min(1, 'ต้องมีรายการสินค้าอย่างน้อย 1 รายการ'),
  mySignature: z.string().optional().nullable(),
  storeSignature: z.string().optional().nullable(),
})

export type ContractInput = z.infer<typeof contractSchema>
export { contractItemSchema, contractSchema }
