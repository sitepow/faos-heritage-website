import { z } from 'zod'

const blogCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'กรุณาระบุชื่อหมวดหมู่'),
  slug: z.string().min(1, 'กรุณาระบุ URL Slug'),
  image: z.string().nullish(),
  isActive: z.boolean().default(true),
})

type BlogCategoryInput = z.infer<typeof blogCategorySchema>

export { blogCategorySchema }
export type { BlogCategoryInput }
