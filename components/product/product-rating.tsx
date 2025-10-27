import { Star } from 'lucide-react'

import type { ComponentProps, FC } from 'react'

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
          className={
            index < Math.floor(rate) ? 'text-yellow-400' : 'text-gray-300'
          }
          fill={index < Math.floor(rate) ? 'currentColor' : 'none'}
          size={15}
        />
      ))}
      <span className='text-default-500'>({rate})</span>
    </div>
  )
}

export { ProductRating }
