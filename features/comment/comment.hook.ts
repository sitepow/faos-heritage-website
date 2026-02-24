'use client'

import { useQuery } from '@tanstack/react-query'

import { getCommentsByPost } from './comment.action'
import { commentQueryKeys } from './comment.query-key'

interface UseCommentsParams {
  postId: string
}
const useComments = ({ postId }: UseCommentsParams) => {
  return useQuery({
    queryKey: commentQueryKeys.lists.byPost(postId),
    queryFn: () => getCommentsByPost(postId),
    enabled: !!postId,
  })
}

export { useComments }
