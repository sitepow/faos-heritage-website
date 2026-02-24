'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createReview } from './review.action'
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

  return {
    submitReview: create.mutateAsync,
    isSubmitting: create.isPending,
  }
}

export { useReviewMutation }
