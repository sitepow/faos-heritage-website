/* eslint-disable no-unused-vars */
'use client'

import { Star } from 'lucide-react'

import { cn } from '@/utils'

interface Props {
  rating: number
  maxRating?: number
  readonly?: boolean
  onRatingChange?: (rating: number) => void
  size?: number
  activeColor?: string
  inactiveColor?: string
}

const StarRating = ({
  rating,
  maxRating = 5,
  readonly = true,
  onRatingChange,
  size = 20,
  activeColor = 'text-warning',
  inactiveColor = 'text-default-200',
}: Props) => {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1
        const isActive = starValue <= rating

        return (
          <button
            key={i}
            className={cn(
              'transition-transform focus:outline-none',
              !readonly && 'cursor-pointer hover:scale-110 active:scale-95',
              isActive ? activeColor : inactiveColor,
            )}
            disabled={readonly}
            type='button'
            onClick={() => onRatingChange?.(starValue)}
          >
            <Star
              fill={isActive ? 'currentColor' : 'none'}
              size={size}
              strokeWidth={2}
            />
          </button>
        )
      })}
    </div>
  )
}

export { StarRating }
