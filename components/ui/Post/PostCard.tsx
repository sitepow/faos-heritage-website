'use client'

import { Card, CardBody, Image, Chip } from '@heroui/react'
import { Eye, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { memo } from 'react'

import type { Prisma } from '@prisma/client'

import { formatDate } from '@/utils'

type PostListItem = Prisma.PostGetPayload<{
  include: {
    category: { select: { name: true } }
    author: { select: { name: true; image: true } }
  }
}>

interface Props {
  post: PostListItem
}

const PostCard = memo(({ post }: Props) => {
  const {
    title,
    slug,
    featuredImage,
    category,
    publishedAt,
    viewCount = 0,
  } = post

  return (
    <Card
      isPressable
      as={Link}
      className='group relative w-full overflow-hidden border-none shadow-lg'
      href={`/blog/${slug}`}
    >
      <CardBody className='relative size-full p-0'>
        <Image
          alt={title}
          className='z-0 h-[500px] w-full object-cover'
          radius='none'
          src={featuredImage || '/images/placeholder-post.jpg'}
          width='100%'
        />

        <div className='absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />

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

          <div className='text-tiny flex items-center gap-4 text-white/70'>
            <div className='flex items-center gap-1'>
              <CalendarDays className='text-primary-400' size={14} />
              <span>{formatDate(publishedAt)}</span>
            </div>
            {viewCount !== 0 && (
              <div className='flex items-center gap-1'>
                <Eye className='text-primary-400' size={14} />
                <span>{viewCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
})

export { PostCard }
