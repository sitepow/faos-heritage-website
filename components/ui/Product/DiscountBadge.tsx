'use client'

import { cn } from '@heroui/react'

import type { ComponentProps } from 'react'

interface Props extends ComponentProps<'div'> {
  percentage: number
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const DiscountBadge = ({
  percentage,
  showText = true,
  size = 'md',
  className,
  ...props
}: Props) => {
  if (percentage <= 0) {
    return null
  }

  const sizeClasses = {
    sm: 'size-10',
    md: 'size-12',
    lg: 'size-14',
  }

  return (
    <div
      className={cn(
        'bg-danger border-divider absolute top-4 right-4 z-20 flex items-center justify-center rounded-full border text-white ring-2 ring-white',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <div className='flex flex-col items-center leading-none'>
        {showText && (
          <span
            className={cn(
              'font-medium uppercase',
              size === 'sm' ? 'text-[8px]' : 'text-[10px]',
            )}
          >
            Sale
          </span>
        )}
        <span
          className={cn('font-bold', size === 'sm' ? 'text-xs' : 'text-sm')}
        >
          -{percentage}%
        </span>
      </div>
    </div>
  )
}

export { DiscountBadge }
