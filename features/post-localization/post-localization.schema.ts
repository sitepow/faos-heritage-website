import { z } from 'zod'

const postLocalizationSchema = z.object({
  id: z.string().optional(),
  postId: z.string().min(1, 'ต้องระบุรหัสบทความ'),
  languageCode: z.string().min(2, 'ต้องระบุรหัสภาษา'),
  title: z.string().min(1, 'ต้องระบุชื่อบทความ'),
  summary: z.string().nullish().or(z.literal('')),
  content: z.string().nullish().or(z.literal('')),
})

type PostLocalizationInput = z.infer<typeof postLocalizationSchema>

export { postLocalizationSchema }
export type { PostLocalizationInput }
