'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import type { GetPostsInfiniteResult } from './post.action'
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

const usePosts = ({
  categoryId,
  status,
  limit = 10,
  initialData,
}: {
  categoryId?: string | null
  status?: PostStatus
  limit?: number
  initialData?: GetPostsInfiniteResult
}) => {
  return useQuery({
    queryKey: postQueryKeys.lists.filtered({ categoryId, status, limit }),
    queryFn: () => getPostsInfinite({ categoryId, status, limit }),
    initialData,
  })
}

const usePostsInfinite = ({
  categoryId,
  status,
  limit = 10,
  initialData,
}: {
  categoryId?: string | null
  status?: PostStatus
  limit?: number
  initialData?: GetPostsInfiniteResult
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
    initialData: initialData
      ? { pages: [initialData], pageParams: [null] }
      : undefined,
  })
}

export { usePost, usePosts, usePostsInfinite }
