/* eslint-disable @next/next/no-img-element */
'use client'

import { memo } from 'react'

import type { ComponentProps } from 'react'

import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils'

const PostCardImage = memo(
  ({ src, className, alt, ...props }: ComponentProps<'img'>) => {
    return (
      <figure className='relative size-full overflow-hidden'>
        <img
          alt={alt || 'Post image'}
          className={cn('z-0 size-full object-cover', className)}
          src={src || IMAGE_FALLBACK.EMPTY}
          {...props}
        />
        <div className='absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />
      </figure>
    )
  },
)

export { PostCardImage }
