import { z } from 'zod'

const blogCategoryLocalizationSchema = z.object({
  id: z.string().nullish(),
  blogCategoryId: z.string().min(1, 'ต้องมี Blog Category ID'),
  languageCode: z.string().min(2, 'กรุณาระบุรหัสภาษา'),
  name: z.string().min(1, 'กรุณาระบุชื่อที่แปล'),
})

type BlogCategoryLocalizationInput = z.infer<
  typeof blogCategoryLocalizationSchema
>

export { blogCategoryLocalizationSchema }
export type { BlogCategoryLocalizationInput }
