import { z } from 'zod'

const categorySchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1, 'กรุณาระบุชื่อหมวดหมู่สินค้า'),
  slug: z.string().min(1, 'กรุณาระบุ URL Slug'),
  image: z.string().nullish(),
  isActive: z.boolean().default(true),
})

type CategoryInput = z.infer<typeof categorySchema>

export { categorySchema }
export type { CategoryInput }
