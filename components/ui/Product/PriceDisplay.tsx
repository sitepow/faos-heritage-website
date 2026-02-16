/* eslint-disable no-unused-vars */
'use client'

import type { PriceInfo } from '@/features/product/product.types'
import type { ComponentProps } from 'react'

import { useExchangeRate } from '@/features/exchangeRate/useExchangeRate'
import { cn, formatCurrency } from '@/utils'

interface Props extends ComponentProps<'div'>, Partial<PriceInfo> {
  size?: 'sm' | 'md' | 'lg'
}

const PriceDisplay = ({
  price = 0,
  originalPrice = 0,
  hasDiscount = false,
  discountAmount,
  discountPercentage,
  className,
  size = 'md',
  ...props
}: Props) => {
  const { currencyOptions } = useExchangeRate()

  return (
    <div
      className={cn('flex flex-col items-end gap-0.5', className)}
      {...props}
    >
      <span
        className={cn(
          'font-bold',
          hasDiscount ? 'text-danger' : 'text-default-700',
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-xl',
        )}
      >
        {formatCurrency(price, currencyOptions)}
      </span>

      {hasDiscount && originalPrice > 0 && (
        <span className='text-default-400 text-[10px] font-normal line-through'>
          {formatCurrency(originalPrice, currencyOptions)}
        </span>
      )}
    </div>
  )
}

export { PriceDisplay }
