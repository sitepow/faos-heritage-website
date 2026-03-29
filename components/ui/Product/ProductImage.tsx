'use client'

import { Image } from '@heroui/react'

import type { ComponentProps } from 'react'

import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils'

interface Props extends ComponentProps<'div'> {
  image?: string | null
  className?: string
  fill?: boolean
  hasAnyDiscount?: boolean
  discount?: number
}

const ProductImage = ({
  image,
  className,
  fill,
  hasAnyDiscount,
  discount = 0,
  ...props
}: Props) => {
  const imageSrc = image && image.trim() !== '' ? image : IMAGE_FALLBACK.EMPTY

  return (
    <div
      className={cn(
        'border-default-100 dark:bg-default-50 relative aspect-square size-full shrink-0 rounded-lg border transition-all duration-1000 ease-in-out',
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

      <div className='absolute -top-2 -right-2 z-20 flex gap-2 md:top-8 md:right-8'>
        {hasAnyDiscount && discount > 0 && (
          <div className='flex h-14 w-14 rotate-12 animate-bounce flex-col items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white shadow-lg md:h-20 md:w-20 md:border-4 dark:border-neutral-900'>
            <span className='text-[8px] leading-none md:text-[10px]'>
              UP TO
            </span>
            <span className='text-sm md:text-xl'>{discount}%</span>
          </div>
        )}

        <div className='flex h-14 w-14 rotate-12 animate-bounce flex-col items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white shadow-lg md:h-20 md:w-20 md:border-4 dark:border-neutral-900'>
          <span className='text-sm leading-none md:text-xl'>
            SHOP
            <br />
            NOW!
          </span>
        </div>
      </div>
    </div>
  )
}

export { ProductImage }
