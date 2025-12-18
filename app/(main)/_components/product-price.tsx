import type { ComponentProps, FC } from 'react'

import { formatCurrency, formatCurrencyRange } from '@/utils/number'
import { getRangeDisplayValue } from '@/utils/range'
import { cn } from '@/utils/style'

interface Props {
  price: number
  priceMin: number | null
  priceMax: number | null
  unit?: string
}

const ProductPrice: FC<Props & ComponentProps<'div'>> = ({
  price,
  priceMin,
  priceMax,
  unit = 'item',
  className,
  ...props
}) => {
  const displayPrice = getRangeDisplayValue(
    {
      min: priceMin,
      max: priceMax,
      fallback: price,
    },
    {
      formatSingle: formatCurrency,
      formatRange: formatCurrencyRange,
    },
  )

  return (
    <div
      className={cn('mt-auto flex items-center justify-between', className)}
      {...props}
    >
      <div>
        <span className='text-2xl font-bold text-primary'>{displayPrice}</span>
        <span className='text-xs'> /{unit}</span>
      </div>
    </div>
  )
}

export { ProductPrice }
