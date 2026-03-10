/* eslint-disable no-unused-vars */
'use client'

import type { PriceInfo } from '@/features/product/product.types'
import type { ComponentProps } from 'react'

import { useExchangeRate } from '@/features/exchange-rate/exchange-rate.hook'
import { cn, formatCurrency } from '@/utils'

interface Props extends ComponentProps<'div'>, Partial<PriceInfo> {}

const PriceDisplay = ({
  price = 0,
  originalPrice = 0,
  hasDiscount = false,
  discountAmount,
  discountPercentage,
  className,
  ...props
}: Props) => {
  const { currencyOptions } = useExchangeRate()

  return (
    <div
      className={cn('flex flex-col items-end gap-0.5', className)}
      {...props}
    >
      <span className={cn('text-danger text-lg')}>
        {formatCurrency(price, currencyOptions)}
      </span>

      {hasDiscount && originalPrice > 0 && (
        <span className='text-default-400 text-lg font-normal line-through'>
          {formatCurrency(originalPrice, currencyOptions)}
        </span>
      )}
    </div>
  )
}

export { PriceDisplay }
