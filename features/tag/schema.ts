import { z } from 'zod'

const tagSchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1, 'กรุณาระบุชื่อแท็ก'),
  slug: z.string().min(1, 'กรุณาระบุ slug'),
})

type TagInput = z.infer<typeof tagSchema>

export { tagSchema }
export type { TagInput }
