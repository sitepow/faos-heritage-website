'use client'

import type { GetPostsInfiniteResult } from '@/features/post/action'

import { PostCard, PostCardSkeleton } from './PostCard'

import { PAGINATION } from '@/constants'
import { cn } from '@/utils'

type PostItem = NonNullable<GetPostsInfiniteResult['items'][number]>

interface Props {
  className?: string
  featuredFirst?: boolean
  isFetchingNextPage?: boolean
  isLoading?: boolean
  itemPerPage?: number
  items: GetPostsInfiniteResult['items']
}

const createSkeletonKeys = (count: number) =>
  Array.from({ length: count }, (_, i) => `post-skeleton-${i}`)

const PostSection = ({
  className,
  featuredFirst = true,
  items = [],
  isLoading = false,
  isFetchingNextPage = false,
  itemPerPage = PAGINATION.ITEMS_PER_PAGE,
}: Props) => {
  const shouldShowSkeleton = isLoading || isFetchingNextPage
  const skeletonKeys = createSkeletonKeys(itemPerPage)

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      {!isLoading &&
        items
          .filter((item): item is PostItem => item !== null)
          .map((post, idx) => (
            <PostCard
              key={post.id}
              featured={featuredFirst && idx === 0}
              post={post}
            />
          ))}

      {shouldShowSkeleton &&
        skeletonKeys.map((key, idx) => (
          <PostCardSkeleton key={key} featured={featuredFirst && idx === 0} />
        ))}
    </div>
  )
}

export { PostSection }
