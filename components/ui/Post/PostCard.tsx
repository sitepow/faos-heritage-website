/* eslint-disable @next/next/no-img-element */
'use client'

import { Skeleton } from '@heroui/react'
import Link from 'next/link'
import { memo } from 'react'

import type { Prisma } from '@prisma/client'

import { PostAuthorAvatar } from './PostAuthorAvatar'
import { Dot } from './_components/Dot'

import { IMAGE_FALLBACK } from '@/constants'
import { formatDate } from '@/utils'

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
  const { slug, title, featuredImage, publishedAt, author } = post

  const postHref = `/posts/${slug}`

  return (
    <Link href={postHref}>
      <div className='flex flex-col gap-5'>
        <img
          alt={title}
          className='h-[250px] w-full rounded-xl object-cover lg:h-[350px]'
          src={featuredImage || IMAGE_FALLBACK.EMPTY}
        />

        <h3 className='text-foreground line-clamp-2 min-h-[3rem] text-2xl leading-tight font-semibold'>
          {title}
        </h3>

        <div className='flex flex-wrap items-center gap-2.5'>
          <PostAuthorAvatar author={author} iconSize={12} />
          <span>{author?.name!}</span>
          <Dot className='text-foreground/50' />
          <span className='opacity-70'>
            {formatDate(publishedAt, 'th', 'numeric')}
          </span>
        </div>
      </div>
    </Link>
  )
})

export { PostCardSkeleton, PostCard }
