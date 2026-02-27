'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createReview, moderateReview } from './review.action'
import { reviewQueryKeys } from './review.query-key'

const useReviewMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewQueryKeys.lists.byProductId(variables.productId),
      })
    },
  })

  const moderate = useMutation({
    mutationFn: moderateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all })
    },
  })

  return {
    submitReview: create.mutateAsync,
    isSubmitting: create.isPending,
    moderate: moderate.mutateAsync,
    isModerating: moderate.isPending,
  }
}

export { useReviewMutation }
