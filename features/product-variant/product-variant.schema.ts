import { z } from 'zod'

const variantSchema = z.object({
  id: z.string().nullish(),
  productId: z.string().nullish(),
  image: z.string().nullish(),
  name: z
    .string('ชื่อตัวเลือกสินค้าต้องเป็นข้อความ')
    .min(1, 'กรุณาระบุชื่อตัวเลือกสินค้า (ห้ามเว้นว่าง)'),
  price: z.number('ราคาต้องเป็นตัวเลขเท่านั้น').min(0, 'ราคาต้องไม่ต่ำกว่า 0'),
  weight: z
    .number('น้ำหนักต้องเป็นตัวเลขเท่านั้น')
    .min(0, 'น้ำหนักต้องไม่ต่ำกว่า 0'),
  stockQuantity: z
    .number('จำนวนสต็อกต้องเป็นตัวเลขเท่านั้น')
    .min(0, 'จำนวนสต็อกต้องไม่ต่ำกว่า 0'),
  isActive: z.boolean(),
})

type VariantInput = z.infer<typeof variantSchema>

export { variantSchema }
export type { VariantInput }
