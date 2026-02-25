'use client'

import { Card, CardBody, Skeleton } from '@heroui/react'
import Link from 'next/link'
import { memo } from 'react'

import type { Prisma } from '@prisma/client'

import { CategoryChip } from '../CategoryChip'
import { PostCardImage } from '../Post/_components/PostCardImage'
import { PostCardMeta } from '../Post/_components/PostCardMeta'

import { IMAGE_FALLBACK } from '@/constants'

type PostListItem = Prisma.PostGetPayload<{
  include: {
    category: { select: { name: true } }
    author: { select: { name: true; image: true } }
    _count: {
      select: { comments: true }
    }
  }
}>

interface Props {
  post: PostListItem
}

const PostCardSkeleton = () => <Skeleton className='h-[420px] w-full' />

const PostCard = memo(({ post }: Props) => {
  const {
    slug,
    title,
    featuredImage,
    category,
    publishedAt,
    viewCount = 0,
    author,
    _count,
  } = post

  const postHref = `/posts/${slug}`

  return (
    <Card
      as='article'
      className='group border-default-100 relative w-full overflow-hidden border'
      radius='sm'
      shadow='none'
    >
      <CardBody className='relative size-full p-0'>
        <Link
          aria-label={title || 'Read post'}
          className='absolute inset-0 z-30'
          href={postHref}
        />

        <PostCardImage
          alt={title}
          className='h-[500px]'
          src={featuredImage || IMAGE_FALLBACK.EMPTY}
        />

        <div className='absolute inset-0 z-20 flex flex-col justify-end p-5'>
          {category?.name && <CategoryChip categoryName={category?.name!} />}

          <h3 className='my-4 line-clamp-3 text-2xl leading-tight font-bold tracking-tight text-white md:text-3xl'>
            {title}
          </h3>

          <PostCardMeta
            author={author}
            commentCount={_count?.comments || 0}
            publishedAt={publishedAt!}
            viewCount={viewCount}
          />
        </div>
      </CardBody>
    </Card>
  )
})

export { PostCardSkeleton, PostCard }
