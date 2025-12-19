/* eslint-disable react/no-array-index-key */
import type { GetProductResult } from '@/app/(main)/actions/product'
import type { FC } from 'react'

import { ProductCard, ProductCardSkeleton } from '../card/product'

import { ITEM_PER_PAGE } from '@/utils/const'

interface Props {
  items: GetProductResult[]
  hideIcon?: boolean
  isLoading?: boolean
  itemPerPage?: number
  isFetchingNextPage?: boolean
}

const ProductsSection: FC<Props> = ({
  items = [],
  isLoading,
  itemPerPage = ITEM_PER_PAGE,
  isFetchingNextPage,
}) => {
  const isFetching = isLoading || isFetchingNextPage

  return (
    <div className='grid w-full gap-2 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-4'>
      {!isLoading &&
        items?.map((product) => (
          <ProductCard key={product.id} className='w-full' product={product} />
        ))}

      {isFetching &&
        [...Array(itemPerPage)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
    </div>
  )
}

export { ProductsSection }
