import { z } from 'zod'

const commentSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, 'nameRequired'),
  productId: z.string().optional(),
  postId: z.string().optional(),
  parentId: z.string().optional().nullable(),
})

type CommentInput = z.infer<typeof commentSchema>

export { commentSchema }
export type { CommentInput }
