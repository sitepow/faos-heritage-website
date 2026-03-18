import { PostStatus } from '@prisma/client'
import { z } from 'zod'

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  viewCount: z.number().default(0),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  keywords: z.array(z.string()).default([]),
  status: z.enum(PostStatus).default(PostStatus.DRAFT),
  publishedAt: z.date().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).default([]),
})

type PostInput = z.infer<typeof postSchema>

export { postSchema }
export type { PostInput }
