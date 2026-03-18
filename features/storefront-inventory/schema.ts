import { z } from 'zod'

const storefrontInventorySchema = z.object({
  storefrontId: z.string().min(1, 'กรุณาระบุหน้าร้าน'),
  productId: z.string().min(1, 'กรุณาเลือกสินค้า'),
  variantId: z.string().nullable().optional(),

  stockQuantity: z.number().min(1, 'กรุณาระบุจำนวนอย่างน้อย 1 ชิ้น'),

  direction: z.enum(['IN', 'OUT'], {
    error: 'กรุณาเลือกทิศทางการโอนสินค้า',
  }),

  retailPrice: z.number().min(0, 'กรุณาระบุราคาขายหน้าร้าน'),
  netPrice: z.number().min(0, 'กรุณาระบุราคาที่คุณได้รับจริง'),
})

type StorefrontInventoryInput = z.infer<typeof storefrontInventorySchema>

export { storefrontInventorySchema }
export type { StorefrontInventoryInput }
