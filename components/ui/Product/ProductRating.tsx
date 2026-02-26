'use client'

import { StarRating } from '../StarRating'

import { useProductRating } from '@/features/product/product.hook'
import { cn } from '@/utils'

interface Props {
  reviews?: { rating: number }[]
  totalReviews: number
  size?: number
  className?: string
  starActiveColor?: string
  starInactiveColor?: string
}

const ProductRating = ({
  reviews = [],
  totalReviews,
  size = 14,
  className,
  starActiveColor,
  starInactiveColor,
}: Props) => {
  const { averageRating } = useProductRating(reviews)

  return (
    <div className='flex items-center gap-1'>
      <StarRating
        activeColor={starActiveColor}
        inactiveColor={starInactiveColor}
        rating={averageRating}
        size={size}
      />
      <span className={cn('text-default-100 text-xs', className)}>
        ({totalReviews})
      </span>
    </div>
  )
}

export { ProductRating }
