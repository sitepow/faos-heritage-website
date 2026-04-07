import { z } from 'zod'

const faqSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1, 'กรุณาระบุ Slug'),
  content: z.string().optional().nullable(),
})

type FaqInput = z.infer<typeof faqSchema>

export { faqSchema }
export type { FaqInput }
