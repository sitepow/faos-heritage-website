import type { ReviewStatus } from '@prisma/client'

type ReviewFilters = {
  status?: ReviewStatus
}

const reviewQueryKeys = {
  all: ['reviews'] as const,
  lists: {
    all: () => [...reviewQueryKeys.all, 'list'] as const,
    byProductId: (productId: string, filters: ReviewFilters = {}) =>
      [...reviewQueryKeys.lists.all(), productId, filters] as const,
  },
}

export { reviewQueryKeys }
export type { ReviewFilters }
