import { z } from 'zod'

type CategoryInput = z.infer<typeof categorySchema>

const categorySchema = z.object({
  id: z.string().nullish(),
  name: z
    .string('ชื่อหมวดหมู่ต้องเป็นข้อความ')
    .min(1, 'กรุณาระบุชื่อหมวดหมู่ (ห้ามว่างเปล่า)'),
  slug: z.string().nullish(),
  image: z.string().nullish(),
  description: z.string().nullish(),
  isActive: z.boolean(),
})

export type { CategoryInput }
export { categorySchema }
