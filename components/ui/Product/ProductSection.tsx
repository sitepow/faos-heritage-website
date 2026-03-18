'use client'

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

const ProductSection = ({
  items = [],
  isLoading = false,
  isFetchingNextPage = false,
  itemPerPage = PAGINATION.ITEMS_PER_PAGE,
}: Props) => {
  const shouldShowSkeleton = isLoading || isFetchingNextPage
  const skeletonKeys = createSkeletonKeys(itemPerPage)

  return (
    <ul className='container mx-auto grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
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
}

export { ProductSection }
