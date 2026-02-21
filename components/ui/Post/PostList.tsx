'use client'

import { PostStatus } from '@prisma/client'

import { PostCard } from './PostCard'

import { Container } from '@/components/layouts/Container'
import { usePostsInfinite } from '@/features/post/post.hook'
import { useWindowInfiniteScroll } from '@/hooks/useWindowInfiniteScroll'

interface Props {
  categoryId?: string | null
}

const PostList = ({ categoryId }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePostsInfinite({
      categoryId,
      status: PostStatus.PUBLISHED,
      limit: 12,
    })

  useWindowInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 400,
  })

  const posts = data?.pages.flatMap((page) => page.items) || []

  return (
    <Container className='grid gap-5 sm:grid-cols-2'>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Container>
  )
}

export { PostList }
