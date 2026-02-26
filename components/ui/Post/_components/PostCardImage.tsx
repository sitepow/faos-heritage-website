'use client'

import { Image } from '@heroui/react'
import { memo } from 'react'

import type { ComponentProps } from 'react'

import { PostBrandBadge } from './PostBrandBadge'

import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils'

const PostCardImage = memo(
  ({ src, className, alt, ...props }: ComponentProps<typeof Image>) => {
    return (
      <figure className='relative size-full overflow-hidden'>
        <PostBrandBadge hasImage={!!src} />
        <Image
          alt={alt}
          className={cn('z-0 size-full object-cover', className)}
          radius='none'
          shadow='none'
          src={src || IMAGE_FALLBACK.EMPTY}
          width='100%'
          {...props}
        />
        <div className='from-primary/90 via-primary/40 absolute inset-0 z-10 bg-gradient-to-t to-transparent' />
      </figure>
    )
  },
)

export { PostCardImage }
