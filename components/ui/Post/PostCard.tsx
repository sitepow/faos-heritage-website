'use client'

import { Card, CardBody, Chip, Skeleton } from '@heroui/react'
import Link from 'next/link'
import { memo } from 'react'

import type { Prisma } from '@prisma/client'

import { PostCardImage } from './_components/PostCardImage'
import { PostCardMeta } from './_components/PostCardMeta'

import { IMAGE_FALLBACK } from '@/constants'
import { generateSlugWithId } from '@/utils'

type PostListItem = Prisma.PostGetPayload<{
  include: {
    category: { select: { name: true } }
    author: { select: { name: true; image: true } }
  }
}>

interface Props {
  post: PostListItem
}

const PostCardSkeleton = () => <Skeleton className='h-[420px] w-full' />

const PostCard = memo(({ post }: Props) => {
  const {
    id,
    title,
    featuredImage,
    category,
    publishedAt,
    viewCount = 0,
    author,
  } = post

  return (
    <Card
      as={Link}
      className='group relative w-full overflow-hidden border-none shadow-lg'
      href={`/posts/${generateSlugWithId(title!, id!)}`}
      radius='sm'
    >
      <CardBody className='relative size-full p-0'>
        <PostCardImage
          alt={title}
          className='h-[500px]'
          src={featuredImage || IMAGE_FALLBACK.EMPTY}
        />

        <div className='absolute inset-0 z-20 flex flex-col justify-end p-5'>
          {category?.name && (
            <div className='mb-2'>
              <Chip
                className='bg-primary text-tiny h-6 border-none font-bold text-white uppercase'
                size='sm'
                variant='flat'
              >
                {category.name}
              </Chip>
            </div>
          )}

          <h3 className='mb-3 line-clamp-3 text-xl leading-tight font-bold text-white md:text-2xl'>
            {title}
          </h3>

          <PostCardMeta
            author={author}
            publishedAt={publishedAt!}
            viewCount={viewCount}
          />
        </div>
      </CardBody>
    </Card>
  )
})

export { PostCardSkeleton, PostCard }
