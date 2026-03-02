'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import type { GetPostResult, GetPostsInfiniteResult } from './post.action'
import type { PostStatus } from '@prisma/client'

import {
  getPostAdmin,
  getPostBySlug,
  getPostsAdmin,
  getPostsInfinite,
  getPostStats,
} from './post.action'
import { postQueryKeys } from './post.query-key'

interface UsePostParams {
  slug: string
  locale?: string
  initialData?: GetPostResult
}

interface UsePostsParams {
  categoryId?: string | null
  status?: PostStatus
  limit?: number
  locale?: string
  initialData?: GetPostsInfiniteResult
  excludeId?: string
}

const usePost = ({ slug, locale, initialData }: UsePostParams) => {
  return useQuery({
    queryKey: postQueryKeys.details.bySlug(slug, { locale }),
    queryFn: () => getPostBySlug(slug, locale),
    initialData,
    enabled: !!slug,
  })
}

const usePosts = ({
  categoryId,
  status,
  limit = 10,
  locale,
  initialData,
  excludeId,
}: UsePostsParams) => {
  return useQuery({
    queryKey: postQueryKeys.lists.filtered({
      categoryId,
      status,
      limit,
      locale,
      excludeId,
    }),
    queryFn: () =>
      getPostsInfinite({ categoryId, status, limit, locale, excludeId }),
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

const usePostsAdmin = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: [...postQueryKeys.lists.all(), 'admin', { page, limit }],
    queryFn: () => getPostsAdmin(page, limit),
  })
}

const usePostAdmin = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [...postQueryKeys.details.all(), 'admin', id],
    queryFn: () => getPostAdmin(id),
    enabled: !!id && enabled,
  })
}

const usePostStats = () => {
  return useQuery({
    queryKey: postQueryKeys.stats(),
    queryFn: () => getPostStats(),
  })
}

export {
  usePost,
  usePosts,
  usePostsInfinite,
  usePostsAdmin,
  usePostAdmin,
  usePostStats,
}
