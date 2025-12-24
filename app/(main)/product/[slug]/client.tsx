'use client'

import { BreadcrumbItem, Breadcrumbs, Skeleton, Tab, Tabs } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/action/product'

import {
  ProductCart,
  ProductDescription,
  ProductImagePreview,
  ProductReview,
  ProductSimilar,
} from './components'
import { useProductDetailStore } from './store'

import { getProduct } from '@/app/(dashboard)/dashboard/product/action/product'
import { PageNotFound } from '@/components/common/page-not-found'
import { AdvertiseBanner } from '@/components/features/banner/advertise'
import { CertificateBanner } from '@/components/features/banner/certificate'

interface ProductClientProps {
  initialProduct: GetProductResult
  productId: string
  userId: string
}

export const ProductClient = ({
  initialProduct,
  productId,
}: ProductClientProps) => {
  const { setProductDetailState } = useProductDetailStore()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => getProduct(productId, userId),
    placeholderData: initialProduct,
    enabled: !!productId,
  })

  useEffect(() => {
    if (product) {
      setProductDetailState({ product })
    }
  }, [product, setProductDetailState])

  if (!product) {
    return <PageNotFound>Product not found</PageNotFound>
  }

  return (
    <section className='flex flex-col gap-4'>
      {isLoading ? (
        <Skeleton className='h-5 max-w-72' />
      ) : (
        <Breadcrumbs className='font-bold'>
          <BreadcrumbItem>Homepage</BreadcrumbItem>
          <BreadcrumbItem>Product</BreadcrumbItem>
          <BreadcrumbItem>{product.category?.name}</BreadcrumbItem>
          <BreadcrumbItem>{product?.name}</BreadcrumbItem>
        </Breadcrumbs>
      )}

      <div className='grid items-start gap-2 lg:grid-cols-2'>
        <ProductImagePreview
          images={product.images.map((image) => image.url)}
        />
        <ProductCart />
      </div>

      <Tabs className='mx-auto' variant='bordered'>
        <Tab title='Description'>
          <ProductDescription />
        </Tab>
        <Tab title='Review'>
          <ProductReview />
        </Tab>
      </Tabs>

      <CertificateBanner />
      <AdvertiseBanner />
      <ProductSimilar />
    </section>
  )
}
