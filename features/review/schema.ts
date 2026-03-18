import { ReviewStatus } from '@prisma/client'
import { z } from 'zod'

const reviewSchema = z.object({
  id: z.string().optional(),
  productId: z.string().min(1, 'กรุณาระบุรหัสสินค้า'),
  rating: z.number().min(1, 'กรุณาให้คะแนนอย่างน้อย 1 ดาว').max(5),
  title: z.string().nullish(),
  comment: z.string().nullish().or(z.string().length(0)),
  images: z.array(z.string()).default([]),
  status: z.nativeEnum(ReviewStatus).default(ReviewStatus.PENDING),
})

const reviewModerationSchema = reviewSchema.pick({
  id: true,
  status: true,
  comment: true,
})

type ReviewInput = z.infer<typeof reviewSchema>
type ReviewModerationInput = z.infer<typeof reviewModerationSchema>

export { reviewSchema, reviewModerationSchema }
export type { ReviewInput, ReviewModerationInput }
