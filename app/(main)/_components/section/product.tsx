/* eslint-disable react/no-array-index-key */
import type { ProductItem } from '@/actions/product'
import type { FC } from 'react'

import { ProductCard, ProductCardSkeleton } from '../card/product'

interface Props {
  items: ProductItem[]
  hideIcon?: boolean
  isLoading?: boolean
  itemPerPage?: number
  isFetchingNextPage?: boolean
}

const ProductSection: FC<Props> = ({
  items = [],
  hideIcon,
  isLoading,
  itemPerPage = 8,
  isFetchingNextPage,
}) => {
  const isFetching = isLoading || isFetchingNextPage

  return (
    <div className='grid w-full gap-2 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4'>
      {!isLoading &&
        items?.map((product) => (
          <ProductCard
            key={product.id}
            className='w-full'
            {...product}
            hideIcon={hideIcon}
          />
        ))}

      {isFetching &&
        [...Array(itemPerPage)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
    </div>
  )
}

export { ProductSection }
