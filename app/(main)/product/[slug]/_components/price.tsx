import type { ComponentProps } from 'react'

import { useAppStore } from '@/app/store'
import { formatCurrency, formatCurrencyRange } from '@/utils/number'
import { getRangeDisplayValue } from '@/utils/range'
import { cn } from '@/utils/style'

type ProductPriceProps = ComponentProps<'div'> & {
  price: number
  priceMin: number | null
  priceMax: number | null
  unit?: string
}

export const ProductPrice = ({
  price,
  priceMin,
  priceMax,
  unit = 'item',
  className,
  ...props
}: ProductPriceProps) => {
  const { country } = useAppStore()
  const displayPrice = getRangeDisplayValue(
    {
      min: priceMin,
      max: priceMax,
      fallback: price,
    },
    {
      formatSingle: (value) =>
        formatCurrency(value, {
          currency: country?.currency,
          locale: country?.locale,
        }),
      formatRange: (min, max) =>
        formatCurrencyRange(min, max, {
          currency: country?.currency,
          locale: country?.locale,
        }),
    },
  )

  return (
    <div
      className={cn('mt-auto flex items-center justify-between', className)}
      {...props}
    >
      <div>
        <span className='text-primary text-2xl font-bold'>{displayPrice}</span>
        <span className='text-default-600 text-xs'> /{unit}</span>
      </div>
    </div>
  )
}
