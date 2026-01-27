/* eslint-disable react/no-array-index-key */
import type { GetProductResult } from '@/app/[locale]/(main)/products/action'

import { ProductCard, ProductCardSkeleton } from './card'

import { ITEM_PER_PAGE } from '@/constants/app'

interface ProductSectionProps {
  items: GetProductResult[]
  hideIcon?: boolean
  isLoading?: boolean
  itemPerPage?: number
  isFetchingNextPage?: boolean
}

export const ProductSection = ({
  items = [],
  isLoading,
  itemPerPage = ITEM_PER_PAGE,
  isFetchingNextPage,
}: ProductSectionProps) => {
  const isFetching = isLoading || isFetchingNextPage

  return (
    <div className='container mx-auto grid w-full gap-2 sm:grid-cols-2 md:gap-4 xl:grid-cols-4'>
      {!isLoading &&
        items?.map((product) => (
          <ProductCard
            key={product.id}
            className='size-full'
            product={product}
          />
        ))}

      {isFetching &&
        [...Array(itemPerPage)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
    </div>
  )
}
