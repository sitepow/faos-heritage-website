import { Star } from 'lucide-react'

import type { ComponentProps, FC } from 'react'

import { formatNumber } from '@/utils/number'

interface Props {
  rate?: number
}

const ProductRating: FC<ComponentProps<'div'> & Props> = ({
  rate = 0,
  ...props
}) => {
  return (
    <div {...props} className='flex items-center gap-0.5'>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={index < Math.floor(rate) ? 'text-primary' : 'text-primary'}
          fill={index < Math.floor(rate) ? 'currentColor' : 'none'}
          size={15}
        />
      ))}
      <span className='flex-wrap text-default-500'>({formatNumber(0)})</span>
    </div>
  )
}

export { ProductRating }
