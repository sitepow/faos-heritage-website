'use client'

import { memo, useMemo } from 'react'

import type { GetProductsInfiniteResult } from '@/features/product/types'

import { ProductCard, ProductCardSkeleton } from './ProductCard'

import { PAGINATION } from '@/constants'

interface Props {
  items: GetProductsInfiniteResult['items']
  isLoading?: boolean
  isFetchingNextPage?: boolean
  itemPerPage?: number
}

const createSkeletonKeys = (count: number) =>
  Array.from({ length: count }, (_, i) => `product-skeleton-${i}`)

const ProductSection = memo(
  ({
    items = [],
    isLoading = false,
    isFetchingNextPage = false,
    itemPerPage = PAGINATION.ITEMS_PER_PAGE,
  }: Props) => {
    const shouldShowSkeleton = isLoading || isFetchingNextPage
    const skeletonKeys = useMemo(
      () => (shouldShowSkeleton ? createSkeletonKeys(itemPerPage) : []),
      [shouldShowSkeleton, itemPerPage],
    )

    return (
      <ul className='grid w-full grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4'>
        {!isLoading &&
          items.map((product) => (
            <li key={product?.id!} className='min-w-0 list-none'>
              <ProductCard className='size-full' product={product} />
            </li>
          ))}

        {shouldShowSkeleton &&
          skeletonKeys.map((key) => (
            <li key={key} className='min-w-0 list-none'>
              <ProductCardSkeleton />
            </li>
          ))}
      </ul>
    )
  },
)

ProductSection.displayName = 'ProductSection'

export { ProductSection }
