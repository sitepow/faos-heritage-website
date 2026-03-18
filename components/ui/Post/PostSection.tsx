'use client'

import type { GetPostsInfiniteResult } from '@/features/post/action'

import { PostCard, PostCardSkeleton } from './PostCard'

import { PAGINATION } from '@/constants'

type PostItem = NonNullable<GetPostsInfiniteResult['items'][number]>

interface Props {
  items: GetPostsInfiniteResult['items']
  isLoading?: boolean
  isFetchingNextPage?: boolean
  itemPerPage?: number
}

const createSkeletonKeys = (count: number) =>
  Array.from({ length: count }, (_, i) => `post-skeleton-${i}`)

const PostSection = ({
  items = [],
  isLoading = false,
  isFetchingNextPage = false,
  itemPerPage = PAGINATION.ITEMS_PER_PAGE,
}: Props) => {
  const shouldShowSkeleton = isLoading || isFetchingNextPage
  const skeletonKeys = createSkeletonKeys(itemPerPage)

  return (
    <ul className='container mx-auto grid gap-5 xl:grid-cols-2'>
      {!isLoading &&
        items
          .filter((item): item is PostItem => item !== null)
          .map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}

      {shouldShowSkeleton &&
        skeletonKeys.map((key) => (
          <li key={key}>
            <PostCardSkeleton />
          </li>
        ))}
    </ul>
  )
}

export { PostSection }
