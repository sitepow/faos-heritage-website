import { z } from 'zod'

const categoryLocalizationSchema = z.object({
  id: z.string().nullish(),
  categoryId: z.string().min(1, 'ต้องมี Category ID'),
  languageCode: z.string().min(2, 'กรุณาระบุรหัสภาษา'),
  name: z.string().min(1, 'กรุณาระบุชื่อที่แปล'),
})

type CategoryLocalizationInput = z.infer<typeof categoryLocalizationSchema>

export { categoryLocalizationSchema }
export type { CategoryLocalizationInput }
