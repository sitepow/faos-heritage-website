import { z } from 'zod'

const productLocalizationSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, 'ไม่พบรหัสสินค้า (productId)'),
  languageCode: z
    .string()
    .min(2, 'รหัสภาษาต้องมีอย่างน้อย 2 ตัวอักษร')
    .max(5, 'รหัสภาษาต้องไม่เกิน 5 ตัวอักษร'),

  name: z.string().min(1, 'กรุณาระบุชื่อสินค้าในภาษานี้'),
  summary: z.string().nullish(),
  description: z.string().nullish(),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  keywords: z.array(z.string()).default([]),
})

type ProductLocalizationInput = z.infer<typeof productLocalizationSchema>

export { productLocalizationSchema }
export type { ProductLocalizationInput }
