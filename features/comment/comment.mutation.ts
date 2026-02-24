'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createComment, deleteComment } from './comment.action'
import { commentQueryKeys } from './comment.query-key'

const useCommentMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      if (variables.postId) {
        queryClient.invalidateQueries({
          queryKey: commentQueryKeys.lists.byPost(variables.postId),
        })
      }

      if (variables.productId) {
        queryClient.invalidateQueries({
          queryKey: commentQueryKeys.lists.byProduct(variables.productId),
        })
      }
    },
  })

  const remove = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentQueryKeys.all })
    },
  })

  return {
    create: create.mutateAsync,
    isCreating: create.isPending,
    remove: remove.mutateAsync,
    isRemoving: remove.isPending,
  }
}

export { useCommentMutation }
