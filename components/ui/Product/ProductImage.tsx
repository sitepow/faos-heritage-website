'use client'

/* eslint-disable @next/next/no-img-element */
import { memo } from 'react'

import type { ComponentProps } from 'react'

import { BadgeOverlay } from './BadgeOverlay'

import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils'

interface ProductImageProps extends ComponentProps<'div'> {
  image?: string | null
  className?: string
  hasAnyDiscount?: boolean
  discount?: number
  showBadge?: boolean
  aspectRatio?: 'square' | 'portrait' | 'auto'
}

const ProductImage = memo(
  ({
    image,
    className,
    hasAnyDiscount,
    discount = 0,
    showBadge = false,
    aspectRatio = 'square',
    ...props
  }: ProductImageProps) => {
    const imageSrc = image && image.trim() !== '' ? image : IMAGE_FALLBACK.EMPTY

    let aspectClass = 'aspect-square'
    if (aspectRatio === 'portrait') {
      aspectClass = 'aspect-4/5'
    } else if (aspectRatio === 'auto') {
      aspectClass = ''
    }

    return (
      <div
        className={cn(
          'relative w-full shrink-0 overflow-hidden bg-neutral-100/70 transition-colors dark:bg-neutral-900/50',
          aspectClass,
          className,
        )}
        {...props}
      >
        <img
          alt='product'
          className='h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105'
          loading='lazy'
          src={imageSrc || undefined}
        />

        {showBadge && (
          <BadgeOverlay discount={discount} hasAnyDiscount={hasAnyDiscount} />
        )}
      </div>
    )
  },
)

ProductImage.displayName = 'ProductImage'

export { ProductImage }
