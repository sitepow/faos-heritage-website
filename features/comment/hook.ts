/* eslint-disable no-nested-ternary */
'use client'

import { useQuery } from '@tanstack/react-query'

import { getComments } from './action'
import { commentQueryKeys } from './query-key'

interface UseCommentsParams {
  postId?: string
  productId?: string
}

const useComments = ({ postId, productId }: UseCommentsParams) => {
  const queryKey = postId
    ? commentQueryKeys.lists.byPost(postId)
    : productId
      ? commentQueryKeys.lists.byProduct(productId)
      : commentQueryKeys.lists.all()

  return useQuery({
    queryKey,
    queryFn: () => getComments({ postId, productId }),
    enabled: !!(postId || productId),
  })
}

export { useComments }
