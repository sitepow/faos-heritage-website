import { z } from 'zod'

export const variantSchema = z.object({
  id: z.string().nullish(),
  productId: z.string().nullish(),
  name: z
    .string('ชื่อสินค้าต้องเป็นข้อความ')
    .min(1, 'กรุณาระบุชื่อสินค้า (ห้ามว่างเปล่า)'),
  sku: z.string().nullish(),
  price: z
    .number('ราคาต้องเป็นตัวเลขที่ถูกต้อง')
    .min(0, 'ราคาต้องมีค่าตั้งแต่ 0 ขึ้นไป'),
  stockQuantity: z.number('จำนวนสินค้าคงคลัง ต้องเป็นตัวเลขที่ถูกต้อง'),
  isActive: z.boolean(),
})

export type VariantInput = z.infer<typeof variantSchema>
