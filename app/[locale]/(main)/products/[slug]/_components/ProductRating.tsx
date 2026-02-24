'use client'

import { StarRating } from '@/components/ui/StarRating'
import { useProductRating } from '@/features/product/product.hook'

interface Props {
  reviews?: { rating: number }[]
  totalReviews: number
  size?: number
}

const ProductRating = ({ reviews = [], totalReviews, size = 14 }: Props) => {
  const { averageRating } = useProductRating(reviews)

  return (
    <div className='flex items-center gap-1'>
      <StarRating rating={averageRating} size={size} />
      <span className='text-default-400 text-xs'>({totalReviews})</span>
    </div>
  )
}

export { ProductRating }
