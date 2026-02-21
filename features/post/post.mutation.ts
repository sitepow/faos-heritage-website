import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createPost, updatePost, deletePost } from './post.action'
import { postQueryKeys } from './post.query-key'

const usePostMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists.all() })
    },
  })

  const update = useMutation({
    mutationFn: updatePost,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.lists.all() })
      queryClient.invalidateQueries({
        queryKey: postQueryKeys.details.byId(variables.id as string),
      })
    },
  })

  const remove = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all })
    },
  })

  return {
    create: create.mutateAsync,
    isCreating: create.isPending,
    update: update.mutateAsync,
    isUpdating: update.isPending,
    remove: remove.mutateAsync,
    isDeleting: remove.isPending,
  }
}

export { usePostMutation }
