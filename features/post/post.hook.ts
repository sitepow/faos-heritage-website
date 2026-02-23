'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import type { GetPostResult, GetPostsInfiniteResult } from './post.action'
import type { PostStatus } from '@prisma/client'

import { getPost, getPostsInfinite } from './post.action'
import { postQueryKeys } from './post.query-key'

interface UsePostParams {
  id: string
  locale?: string
  initialData?: GetPostResult
}

interface UsePostsParams {
  categoryId?: string | null
  status?: PostStatus
  limit?: number
  locale?: string
  initialData?: GetPostsInfiniteResult
}

const usePost = ({ id, locale, initialData }: UsePostParams) => {
  return useQuery({
    queryKey: postQueryKeys.details.byId(id, { locale }),
    queryFn: () => getPost(id, locale),
    initialData,
    enabled: !!id,
  })
}

const usePosts = ({
  categoryId,
  status,
  limit = 10,
  locale,
  initialData,
}: UsePostsParams) => {
  return useQuery({
    queryKey: postQueryKeys.lists.filtered({
      categoryId,
      status,
      limit,
      locale,
    }),
    queryFn: () => getPostsInfinite({ categoryId, status, limit, locale }),
    initialData,
  })
}

const usePostsInfinite = ({
  categoryId,
  status,
  limit = 10,
  locale,
  initialData,
}: UsePostsParams) => {
  return useInfiniteQuery({
    queryKey: postQueryKeys.lists.filtered({
      categoryId,
      status,
      limit,
      locale,
    }),
    queryFn: ({ pageParam }) =>
      getPostsInfinite({
        cursor: pageParam as string | undefined,
        limit,
        categoryId,
        status,
        locale,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? { pages: [initialData], pageParams: [null] }
      : undefined,
  })
}

export { usePost, usePosts, usePostsInfinite }
