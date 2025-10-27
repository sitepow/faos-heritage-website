import type { Product } from '@/types'
import type { FC } from 'react'

import { ProductCard } from './product-card'

interface Props {
  items: Product[]
}

const ProductSection: FC<Props> = ({ items = [] }) => {
  return (
    <div className='grid w-full gap-2 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4'>
      {items?.map((product) => (
        <ProductCard className='w-full' key={product.id} {...product} />
      ))}
    </div>
  )
}

export { ProductSection }
