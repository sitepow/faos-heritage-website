import { Star } from 'lucide-react'

import type { ComponentProps } from 'react'

import { formatNumber } from '@/utils/number'
import { cn } from '@/utils/style'

type ProductRatingProps = ComponentProps<'div'> & {
  rate?: number
}

export const ProductRating = ({ rate = 0, ...props }: ProductRatingProps) => {
  return (
    <div {...props} className='flex items-center gap-1'>
      <div className='flex items-center gap-0.5'>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={cn(
              'transition-colors',
              index < Math.floor(rate)
                ? 'text-zinc-800 dark:text-zinc-200'
                : 'text-zinc-200 dark:text-zinc-800',
            )}
            fill={index < Math.floor(rate) ? 'currentColor' : 'none'}
            size={12}
            strokeWidth={3}
          />
        ))}
      </div>
      <span className='ml-1 text-[10px] font-black text-zinc-300'>
        {formatNumber(0)}
      </span>
    </div>
  )
}
