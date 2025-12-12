/* eslint-disable no-nested-ternary */
import type { ComponentProps, FC } from 'react'

import { formatCurrency, formatCurrencyRange } from '@/utils/number'
import { cn } from '@/utils/style'

interface Props {
  price: number
  priceMin: number | null
  priceMax: number | null
  unit?: string
}

const Price: FC<Props & ComponentProps<'div'>> = ({
  price,
  priceMin,
  priceMax,
  unit = 'ชิ้น',
  className,
  ...props
}) => {
  const hasVariant =
    priceMin !== null &&
    priceMax !== null &&
    typeof priceMin === 'number' &&
    typeof priceMax === 'number'

  const isRange = hasVariant && priceMin !== priceMax

  const displayPrice = hasVariant
    ? isRange
      ? formatCurrencyRange(priceMin, priceMax)
      : formatCurrency(priceMin)
    : formatCurrency(price)

  return (
    <div
      className={cn('mt-auto flex items-center justify-between', className)}
      {...props}
    >
      <div>
        <span className='text-2xl font-bold text-primary-website'>
          {displayPrice}
        </span>
        <span className='text-xs'> /{unit}</span>
      </div>
    </div>
  )
}

export { Price }
