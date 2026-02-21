'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import type { PostStatus } from '@prisma/client'

import { getPost, getPostsInfinite } from './post.action'
import { postQueryKeys } from './post.query-key'

const usePost = (id: string) => {
  return useQuery({
    queryKey: postQueryKeys.details.byId(id),
    queryFn: () => getPost(id),
    enabled: !!id,
  })
}

const usePostsInfinite = ({
  categoryId,
  status,
  limit = 10,
}: {
  categoryId?: string | null
  status?: PostStatus
  limit?: number
}) => {
  return useInfiniteQuery({
    queryKey: postQueryKeys.lists.filtered({ categoryId, status, limit }),
    queryFn: ({ pageParam }) =>
      getPostsInfinite({
        cursor: pageParam as string | undefined,
        limit,
        categoryId,
        status,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}

export { usePost, usePostsInfinite }
