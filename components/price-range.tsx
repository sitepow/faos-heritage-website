import clsx from 'clsx'

import type { ComponentProps, FC } from 'react'

import { formatCurrency } from '@/utils/number'

interface Props {
  price: number
}

const PriceRange: FC<Props & ComponentProps<'div'>> = ({
  price,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx('mt-auto flex items-center justify-between', className)}
      {...props}
    >
      <div className=''>
        <span className='text-2xl font-bold text-red-800'>
          {formatCurrency(price)}
        </span>
        <span className='text-xs'> /EACH</span>
      </div>
    </div>
  )
}

export { PriceRange }
