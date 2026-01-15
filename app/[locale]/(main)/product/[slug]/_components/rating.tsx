import { Star } from 'lucide-react'

import type { ComponentProps } from 'react'

import { formatNumber } from '@/utils/helpers/number'

type ProductRatingProps = ComponentProps<'div'> & {
  rate?: number
}

export const ProductRating = ({ rate = 0, ...props }: ProductRatingProps) => {
  return (
    <div {...props} className='flex items-center gap-0.5'>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={
            index < Math.floor(rate) ? 'text-default-300' : 'text-default-300'
          }
          fill={index < Math.floor(rate) ? 'currentColor' : 'none'}
          size={15}
        />
      ))}
      <span className='text-default-300 flex-wrap'>({formatNumber(0)})</span>
    </div>
  )
}
