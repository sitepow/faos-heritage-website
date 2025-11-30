import type { ComponentProps, FC } from 'react'

import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'

interface Props {
  price: number
  unit?: string
}

const Price: FC<Props & ComponentProps<'div'>> = ({
  price,
  unit = 'ชิ้น',
  className,
  ...props
}) => {
  return (
    <div className={cn('mt-auto flex items-center justify-between', className)} {...props}>
      <div className=''>
        <span className='text-2xl font-bold text-primary-website'>{formatCurrency(price)}</span>
        <span className='text-xs'> /{unit}</span>
      </div>
    </div>
  )
}

export { Price }
