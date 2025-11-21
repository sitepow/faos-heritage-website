import { z } from 'zod'

export const productSchema = z.object({
  name: z
    .string('ชื่อสินค้าต้องเป็นข้อความ')
    .min(1, 'กรุณาระบุชื่อสินค้า (ห้ามว่างเปล่า)'),
  slug: z
    .string('Slug ต้องเป็นข้อความที่ถูกต้อง')
    .min(1, 'กรุณาระบุ Slug (ห้ามว่างเปล่า)'),
  sku: z.string().optional().nullable(),
  barcode: z.string().optional(),
  price: z
    .number('ราคาต้องเป็นตัวเลขที่ถูกต้อง')
    .min(0, 'ราคาต้องมีค่าตั้งแต่ 0 ขึ้นไป'),
  compareAtPrice: z
    .number('ราคาก่อนลดต้องเป็นตัวเลขที่ถูกต้อง')
    .optional()
    .nullable(),
  costPrice: z
    .number('ราคาต้นทุนต้องเป็นตัวเลขที่ถูกต้อง')
    .optional()
    .nullable(),
  stockQuantity: z.number('จำนวนสินค้าคงคลัง ต้องเป็นตัวเลขที่ถูกต้อง'),
  lowStockAlert: z
    .number('แจ้งเตือนสต็อกต่ำ ต้องเป็นตัวเลขที่ถูกต้อง')
    .optional()
    .nullable(),
  weight: z
    .number('น้ำหนักสินค้า ต้องเป็นตัวเลขที่ถูกต้อง')
    .optional()
    .nullable(),
  categoryId: z.string('กรุณาเลือกหมวดหมู่สินค้า').optional().nullable(),
  description: z.string().optional(),
  metaTitle: z.string('Meta Title ต้องเป็นข้อความที่ถูกต้อง').optional(),
  metaDescription: z
    .string('Meta Description ต้องเป็นข้อความที่ถูกต้อง')
    .optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
})

export type ProductInput = z.infer<typeof productSchema>
