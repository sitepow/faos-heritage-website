'use client'

import { useQuery } from '@tanstack/react-query'

import { getAllReviewsAdmin, getReviews, getReviewStats } from './action'
import { reviewQueryKeys } from './query-key'

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

const useReviewStats = () => {
  return useQuery({
    queryKey: reviewQueryKeys.stats(),
    queryFn: () => getReviewStats(),
  })
}

export { useReviews, useReviewsAdmin, useReviewStats }
