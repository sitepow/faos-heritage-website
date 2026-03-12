'use client'

import { Image } from '@heroui/react'

import type { ComponentProps } from 'react'

import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils'

interface Props extends ComponentProps<'div'> {
  image?: string | null
  className?: string
  fill?: boolean
}

const ProductImage = ({ image, className, fill, ...props }: Props) => {
  const imageSrc = image && image.trim() !== '' ? image : IMAGE_FALLBACK.EMPTY

  return (
    <div
      className={cn(
        'border-default-100 dark:bg-default-50 relative aspect-square size-full shrink-0 overflow-hidden rounded-lg border transition-all duration-1000 ease-in-out',
        className,
      )}
      {...props}
    >
      <Image
        alt='product-image'
        className={cn('size-full object-contain p-2', {
          'object-cover p-0': fill,
        })}
        classNames={{
          wrapper: 'absolute inset-0 !max-w-none size-full',
        }}
        radius='none'
        src={imageSrc || undefined}
      />
    </div>
  )
}

export { ProductImage }
