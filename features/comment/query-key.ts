import type { ReviewStatus } from '@prisma/client'

type CommentFilters = {
  postId?: string
  productId?: string
  status?: ReviewStatus
}

const commentQueryKeys = {
  all: ['comments'] as const,
  lists: {
    all: () => [...commentQueryKeys.all, 'list'] as const,
    byPost: (postId: string, filters: CommentFilters = {}) =>
      [...commentQueryKeys.lists.all(), 'post', postId, filters] as const,
    byProduct: (productId: string, filters: CommentFilters = {}) =>
      [...commentQueryKeys.lists.all(), 'product', productId, filters] as const,
  },
}

export { commentQueryKeys }
export type { CommentFilters }
