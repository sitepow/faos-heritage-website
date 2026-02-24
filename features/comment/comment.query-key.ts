import type { ReviewStatus } from '@prisma/client'

type CommentFilters = {
  postId?: string
  status?: ReviewStatus
}

const commentQueryKeys = {
  all: ['comments'] as const,
  lists: {
    all: () => [...commentQueryKeys.all, 'list'] as const,
    byPost: (postId: string, filters: CommentFilters = {}) =>
      [...commentQueryKeys.lists.all(), postId, filters] as const,
  },
}

export { commentQueryKeys }
export type { CommentFilters }
