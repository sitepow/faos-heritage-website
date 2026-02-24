'use client'

import type { GetPostsInfiniteResult } from '@/features/post/post.action'

import { PostCard, PostCardSkeleton } from './PostCard'

import { Container } from '@/components/layouts/Container'
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
    <Container className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
      {!isLoading &&
        items
          .filter((item): item is PostItem => item !== null)
          .map((post) => <PostCard key={post.id} post={post} />)}

      {shouldShowSkeleton &&
        skeletonKeys.map((key) => <PostCardSkeleton key={key} />)}
    </Container>
  )
}

export { PostSection }
