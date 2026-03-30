'use client'

import { Image } from '@heroui/react'

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
}

const ProductImage = ({
  image,
  className,
  hasAnyDiscount,
  discount = 0,
  showBadge = false,
  ...props
}: ProductImageProps) => {
  const imageSrc = image && image.trim() !== '' ? image : IMAGE_FALLBACK.EMPTY

  return (
    <div
      className={cn(
        'border-default-100 dark:bg-default-50 relative aspect-square size-full shrink-0 rounded-xl border transition-all duration-1000 ease-in-out',
        className,
      )}
      {...props}
    >
      <Image
        alt='product-image'
        className={'size-full rounded-xl object-cover'}
        classNames={{
          wrapper: 'absolute inset-0 !max-w-none size-full',
        }}
        radius='none'
        src={imageSrc || undefined}
      />

      {showBadge && (
        <BadgeOverlay discount={discount} hasAnyDiscount={hasAnyDiscount} />
      )}
    </div>
  )
}

export { ProductImage }
