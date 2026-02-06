'use client'

import { BreadcrumbItem, Breadcrumbs, Tab, Tabs } from '@heroui/react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'

import type { GetProductResult } from '@/features/product/product.action'

import { ProductDescription } from './_components/ProductDescription'
import { ProductImagePreview } from './_components/ProductImagePreview'
import { ProductPurchasePanel } from './_components/ProductPurchasePanel'
import { ProductReview } from './_components/ProductReview'
import { ProductSimilar } from './_components/ProductSectionSemilar'

import { EmptyState } from '@/components/ui/EmptyState'
import { useProductDetailStore } from '@/features/product/product.store'
import { useProduct } from '@/features/product/useProduct'
import { generateSlugWithId } from '@/utils'

interface ProductClientProps {
  initialData: GetProductResult
  productId: string
  userId: string
}

export const ProductClient = ({
  initialData,
  productId,
}: ProductClientProps) => {
  const locale = useLocale()
  const translateProductDetail = useTranslations('productDetail')
  const translateBreadcrumb = useTranslations('navigation.breadcrumb')

  const { setProductDetailState } = useProductDetailStore()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data: product } = useProduct({
    locale,
    productId,
    userId: userId!,
    initialData,
  })

  useEffect(() => {
    if (product) {
      setProductDetailState({ product })
    }
  }, [product, setProductDetailState])

  if (!product) {
    return <EmptyState>Product not found</EmptyState>
  }

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex w-full flex-col gap-5 p-5'>
        <Breadcrumbs className='container mx-auto font-semibold'>
          <BreadcrumbItem href='/'>
            {translateBreadcrumb('home')}
          </BreadcrumbItem>
          <BreadcrumbItem href='/products'>
            {translateBreadcrumb('products')}
          </BreadcrumbItem>
          <BreadcrumbItem
            href={`/categories/${generateSlugWithId(product?.category?.name!, product?.category?.id!)}`}
          >
            {product?.category?.name!}
          </BreadcrumbItem>
        </Breadcrumbs>

        <div className='container mx-auto grid items-start gap-5 lg:grid-cols-2'>
          <div className='min-w-0 overflow-hidden'>
            <ProductImagePreview
              images={product.images.map((image) => image.url)}
            />
          </div>
          <div className='min-w-0 lg:sticky lg:top-20'>
            <ProductPurchasePanel />
          </div>
        </div>

        <Tabs className='mx-auto' variant='light'>
          <Tab title={translateProductDetail('tabs.description')}>
            <ProductDescription />
          </Tab>
          <Tab title={translateProductDetail('tabs.review')}>
            <ProductReview />
          </Tab>
        </Tabs>

        <ProductSimilar />
      </div>
    </section>
  )
}
