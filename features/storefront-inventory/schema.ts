import { z } from 'zod'

const storefrontInventorySchema = z.object({
  storefrontId: z.string().min(1, 'กรุณาระบุหน้าร้าน'),
  productId: z.string().min(1, 'กรุณาเลือกสินค้า'),
  variantId: z.string().nullable().optional(),
  stockQuantity: z.number().optional(),
  direction: z.enum(['IN', 'OUT']).optional(),
  retailPrice: z.number().optional(),
  netPrice: z.number().optional(),
})

type StorefrontInventoryInput = z.infer<typeof storefrontInventorySchema>

export { storefrontInventorySchema }
export type { StorefrontInventoryInput }
