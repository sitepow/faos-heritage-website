import { z } from 'zod'

type ProductInput = z.infer<typeof productSchema>

const productSchema = z.object({
  id: z.string().nullish(),
  name: z
    .string('ชื่อสินค้าต้องเป็นข้อความ')
    .min(1, 'กรุณาระบุชื่อสินค้า (ห้ามว่างเปล่า)'),
  slug: z.string('Slug ต้องเป็นข้อความที่ถูกต้อง').nullish(),
  sku: z.string().nullish(),
  barcode: z.string().nullish(),
  price: z
    .number('ราคาต้องเป็นตัวเลขที่ถูกต้อง')
    .min(0, 'ราคาต้องมีค่าตั้งแต่ 0 ขึ้นไป'),
  compareAtPrice: z.number('ราคาก่อนลดต้องเป็นตัวเลขที่ถูกต้อง').nullish(),
  costPrice: z.number('ราคาต้นทุนต้องเป็นตัวเลขที่ถูกต้อง').nullish(),
  stockQuantity: z.number('จำนวนสินค้าคงคลัง ต้องเป็นตัวเลขที่ถูกต้อง'),
  lowStockAlert: z
    .number('แจ้งเตือนสต็อกต่ำ ต้องเป็นตัวเลขที่ถูกต้อง')
    .nullish(),
  weight: z.number('น้ำหนักสินค้า ต้องเป็นตัวเลขที่ถูกต้อง').nullish(),
  categoryId: z.string('กรุณาเลือกหมวดหมู่สินค้า').nullish(),
  shortDescription: z.string().nullish(),
  description: z.string().nullish(),
  metaTitle: z.string('Meta Title ต้องเป็นข้อความที่ถูกต้อง').nullish(),
  metaDescription: z
    .string('Meta Description ต้องเป็นข้อความที่ถูกต้อง')
    .nullish(),
  isActive: z.boolean(),
  useSeoFromBasicData: z.boolean(),
  isFeatured: z.boolean(),
})

export type { ProductInput }
export { productSchema }
