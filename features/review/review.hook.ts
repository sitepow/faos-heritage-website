'use client'

import { useQuery } from '@tanstack/react-query'

import { getAllReviewsAdmin, getReviews } from './review.action'
import { reviewQueryKeys } from './review.query-key'

interface UseReviewsParams {
  productId: string
}

const useReviews = ({ productId }: UseReviewsParams) => {
  return useQuery({
    queryKey: reviewQueryKeys.lists.byProductId(productId),
    queryFn: () => getReviews(productId),
    enabled: !!productId,
  })
}

const useReviewsAdmin = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: reviewQueryKeys.lists.all(),
    queryFn: () => getAllReviewsAdmin(page, limit),
  })
}

export { useReviews, useReviewsAdmin }
