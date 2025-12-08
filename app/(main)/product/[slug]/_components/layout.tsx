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
import { BannerAdvertise } from '@/components/banner-advertise'
import { CategoryBreadcrumbs } from '@/components/breadcrumbs'
import { NotFound } from '@/components/not-found'

interface Props {
  initialProduct: GetProductResult
  productId: string
  userId: string
}

const ProductLayout: FC<Props> = ({ initialProduct, productId, userId }) => {
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId, userId),
    placeholderData: initialProduct,
    enabled: !!productId,
  })

  if (!product) {
    return (
      <NotFound>
        ขออภัยครับ!{' '}
        <span className='text-primary-website'>
          รหัสสินค้า &quot;{productId}&quot;
        </span>{' '}
        ไม่ตรงกับสิ่งใดเลย โปรดลองหาสินค้าใหม่ได้ที่หน้าหลัก
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

      <BannerAdvertise />

      <DetailSection product={product} />
      <SimilarSection product={product} />
    </section>
  )
}

export { ProductLayout }
