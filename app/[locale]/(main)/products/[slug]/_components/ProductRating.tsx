/* eslint-disable react/no-array-index-key */
'use client'

import { Star } from 'lucide-react'

import type { ComponentProps } from 'react'

import { formatNumber } from '@/utils/number'
import { cn } from '@/utils/style'

type ProductRatingProps = ComponentProps<'div'> & {
  rate?: number
  count?: number
}

const MAX_STAR = 5

const ProductRating = ({
  rate = 0,
  count = 0,
  className,
  ...props
}: ProductRatingProps) => {
  const filledStars = Math.floor(rate)

  return (
    <div {...props} className={cn('flex items-center gap-1', className)}>
      <div className='flex items-center gap-0.5'>
        {Array.from({ length: MAX_STAR }).map((_, index) => {
          const isFilled = index < filledStars

          return (
            <Star
              key={`star-${index}`}
              className={cn(
                'transition-colors',
                isFilled
                  ? 'text-zinc-800 dark:text-zinc-200'
                  : 'text-zinc-200 dark:text-zinc-800',
              )}
              fill={isFilled ? 'currentColor' : 'none'}
              size={12}
              strokeWidth={3}
            />
          )
        })}
      </div>

      <span className='ml-1 text-[10px] font-black text-zinc-300'>
        {formatNumber(count)}
      </span>
    </div>
  )
}

export { ProductRating }
