'use client'

import { Image } from '@heroui/react'
import { memo } from 'react'

import type { ComponentProps } from 'react'

import { PostBrandBadge } from './PostBrandBadge'

import { cn } from '@/utils'

const PostCardImage = memo(
  ({ src, className, ...props }: ComponentProps<typeof Image>) => {
    return (
      <>
        <PostBrandBadge />
        <Image
          className={cn('z-0 size-full object-cover', className)}
          radius='none'
          src={src || '/images/placeholder-post.jpg'}
          width='100%'
          {...props}
        />
        <div className='absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />
      </>
    )
  },
)

export { PostCardImage }
