'use client'

import type { GetProductResult } from '@/app/[locale]/(main)/products/action'

import { ProductCard, ProductCardSkeleton } from './ProductCard'

import { PAGINATION } from '@/constants/app'

interface ProductSectionProps {
  items: GetProductResult[]
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
}: ProductSectionProps) => {
  const shouldShowSkeleton = isLoading || isFetchingNextPage
  const skeletonKeys = createSkeletonKeys(itemPerPage)

  return (
    <div className='container mx-auto grid w-full gap-2 sm:grid-cols-2 md:gap-4 xl:grid-cols-4'>
      {!isLoading &&
        items.map((product) => (
          <ProductCard
            key={product.id}
            className='size-full'
            product={product}
          />
        ))}

      {shouldShowSkeleton &&
        skeletonKeys.map((key) => <ProductCardSkeleton key={key} />)}
    </div>
  )
}

export { ProductSection }
