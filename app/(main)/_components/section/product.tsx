import type { Product } from '@/types'
import type { FC } from 'react'

import { ProductCard } from '../card/product'

interface Props {
  items: Product[]
  hideIcon?: boolean
}

const ProductSection: FC<Props> = ({ items = [], hideIcon }) => {
  return (
    <div className='grid w-full gap-2 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4'>
      {items?.map((product) => (
        <ProductCard
          key={product.id}
          className='w-full'
          {...product}
          hideIcon={hideIcon}
        />
      ))}
    </div>
  )
}

export { ProductSection }
