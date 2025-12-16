'use client'

import { Skeleton } from '@heroui/skeleton'
import { useQuery } from '@tanstack/react-query'

import type { FC } from 'react'

import { CartSection } from './section/cart'
import { DetailSection } from './section/detail'
import { ImageSection } from './section/image'
import { SimilarSection } from './section/similar'

import {
  getProduct,
  type GetProductResult,
} from '@/app/(dashboard)/dashboard/product/actions/product'
import { CategoryBreadcrumbs } from '@/components/breadcrumbs'
import { Certificate } from '@/components/certificate'
import { NotFound } from '@/components/not-found'

interface Props {
  initialProduct: GetProductResult
  productId: string
  userId: string
}

const ProductLayout: FC<Props> = ({ initialProduct, productId, userId }) => {
  const QUERY = {
    PRODUCT: ['product', productId],
  }

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: QUERY.PRODUCT,
    queryFn: () => getProduct(productId, userId),
    placeholderData: initialProduct,
    enabled: !!productId,
  })

  if (!product) {
    return (
      <NotFound>
        I&apos;m sorry.!{' '}
        <span className='text-primary-website'>
          Product code &quot;{productId}&quot;
        </span>{' '}
        Nothing matches. Please try searching for new products on the homepage.
      </NotFound>
    )
  }

  return (
    <section className='flex flex-col justify-center gap-4 text-center'>
      {isLoadingProduct && <Skeleton className='h-5 max-w-72' />}
      {!isLoadingProduct && (
        <CategoryBreadcrumbs categoryName={product?.category?.name} />
      )}
      <div className='grid gap-4 xl:grid-cols-3'>
        {isLoadingProduct && <Skeleton className='h-[455px] xl:col-span-2' />}
        {!isLoadingProduct && (
          <ImageSection className='xl:col-span-2' product={product} />
        )}
        {isLoadingProduct && <Skeleton />}
        {!isLoadingProduct && <CartSection product={product} />}
      </div>
      <DetailSection product={product} />
      <Certificate />
      <SimilarSection product={product} />
    </section>
  )
}

export { ProductLayout }
