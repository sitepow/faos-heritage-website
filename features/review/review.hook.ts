'use client'

import { useQuery } from '@tanstack/react-query'

import { getProductReviews } from './review.action'
import { reviewQueryKeys } from './review.query-key'

interface UseReviewsParams {
  productId: string
}

const useReviews = ({ productId }: UseReviewsParams) => {
  return useQuery({
    queryKey: reviewQueryKeys.lists.byProductId(productId),
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  })
}

export { useReviews }
