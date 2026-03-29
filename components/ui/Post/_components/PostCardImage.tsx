'use client'

import { Image } from '@heroui/react'
import { memo } from 'react'

import type { ComponentProps } from 'react'

import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils'

const PostCardImage = memo(
  ({ src, className, alt, ...props }: ComponentProps<typeof Image>) => {
    return (
      <figure className='relative size-full overflow-hidden'>
        {/* <PostBrandBadge hasImage={!!src} /> */}
        <Image
          alt={alt}
          className={cn('z-0 size-full object-cover', className)}
          radius='none'
          shadow='none'
          src={src || IMAGE_FALLBACK.EMPTY}
          width='100%'
          {...props}
        />
        <div className='absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />
      </figure>
    )
  },
)

export { PostCardImage }
