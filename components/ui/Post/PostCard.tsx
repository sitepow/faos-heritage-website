/* eslint-disable @next/next/no-img-element */
'use client'

import { Skeleton } from '@heroui/react'
import Link from 'next/link'
import { memo } from 'react'

import type { Prisma } from '@prisma/client'

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

const PostCardSkeleton = () => {
  return <Skeleton className='h-[420px] w-full' />
}

const PostCard = memo(({ post }: Props) => {
  const { slug, title, featuredImage, author } = post

  const postHref = `/posts/${slug}`

  const getInitials = () => {
    if (!author?.name) {
      return 'AU'
    }

    const nameParts = author.name.trim().split(' ')
    if (nameParts.length > 1) {
      const firstName = nameParts[0].charAt(0)
      const lastName = nameParts[nameParts.length - 1].charAt(0)
      return `${firstName}${lastName}`.toUpperCase()
    }

    return nameParts[0].charAt(0).toUpperCase()
  }

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${getInitials()}`

  return (
    <Link href={postHref}>
      <div className='border-default-100 flex flex-col rounded-xl border'>
        <div className='relative'>
          <img
            alt={title}
            className='h-[350px] w-full rounded-xl object-cover'
            src={featuredImage || IMAGE_FALLBACK.EMPTY}
          />
        </div>

        <div className='flex flex-col gap-2.5 p-2.5'>
          <h3 className='text-lg tracking-tight sm:text-xl'>{title}</h3>

          <div className='flex flex-wrap items-center gap-2.5 text-sm'>
            <img
              alt={author?.name || 'author'}
              className='size-[24px] rounded-full'
              src={avatarUrl}
            />
            <span className='text-gray-900 dark:text-gray-400'>
              {author?.name!}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
})

export { PostCardSkeleton, PostCard }
