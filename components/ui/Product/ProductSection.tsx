'use client'

import type { GetProductsInfiniteResult } from '@/features/product/product.types'

import { ProductCard, ProductCardSkeleton } from './ProductCard'

import { Container } from '@/components/layouts/Container'
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
    <Container className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
      {!isLoading &&
        items.map((product) => (
          <ProductCard
            key={product?.name}
            className='size-full'
            product={product}
          />
        ))}

      {shouldShowSkeleton &&
        skeletonKeys.map((key) => <ProductCardSkeleton key={key} />)}
    </Container>
  )
}

export { ProductSection }
