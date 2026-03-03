import { ProductUnit } from '@prisma/client'
import { z } from 'zod'

const productSchema = z.object({
  id: z.string().nullish(),

  name: z.string().min(1, 'กรุณาระบุชื่อสินค้า'),
  slug: z.string().min(1, 'กรุณาระบุ URL Slug'),

  price: z.number('กรุณาระบุราคาให้ถูกต้อง').min(0, 'ราคาต้องไม่ต่ำกว่า 0'),
  salePrice: z
    .number('กรุณาระบุราคาลดให้ถูกต้อง')
    .min(0, 'ราคาลดต้องไม่ต่ำกว่า 0')
    .nullable()
    .optional(),

  stockQuantity: z
    .number('กรุณาระบุจำนวนสต็อกให้ถูกต้อง')
    .min(0, 'จำนวนสต็อกต้องไม่ต่ำกว่า 0'),
  weight: z
    .number('กรุณาระบุน้ำหนักให้ถูกต้อง')
    .min(0, 'น้ำหนักต้องไม่ต่ำกว่า 0')
    .nullable()
    .optional(),

  unit: z
    .enum(Object.values(ProductUnit) as [string, ...string[]])
    .or(z.any())
    .refine((val) => Object.values(ProductUnit).includes(val), {
      message: 'กรุณาเลือกหน่วยสินค้าที่ถูกต้อง',
    }),

  categoryId: z.string().min(1, 'กรุณาเลือกหมวดหมู่สินค้า').nullish(),

  summary: z.string().nullish(),
  description: z.string().nullish(),

  isActive: z.boolean().default(true),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  keywords: z.array(z.string()).default([]),
})

type ProductInput = z.infer<typeof productSchema>

export { productSchema }
export type { ProductInput }
