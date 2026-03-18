import { z } from 'zod'

const tagLocalizationSchema = z.object({
  id: z.string().nullish(),
  tagId: z.string().min(1, 'ต้องมี Tag ID'),
  languageCode: z.string().min(2, 'กรุณาระบุรหัสภาษา'),
  name: z.string().min(1, 'กรุณาระบุชื่อที่แปล'),
})

type TagLocalizationInput = z.infer<typeof tagLocalizationSchema>

export { tagLocalizationSchema }
export type { TagLocalizationInput }
