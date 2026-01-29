'use client'

import { BreadcrumbItem, Breadcrumbs, Skeleton, Tab, Tabs } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'

import type { GetProductResult } from '@/features/product/product.action'

import { ProductDescription } from './_components/ProductDescription'
import { ProductImagePreview } from './_components/ProductImagePreview'
import { ProductCart } from './_components/ProductPurchasePanel'
import { ProductReview } from './_components/ProductReview'
import { ProductSimilar } from './_components/ProductSectionSemilar'
import { useProductDetailStore } from './store'

import { EmptyState } from '@/components/ui/EmptyState'
import { getProduct } from '@/features/product/product.action'
import { generateSlugWithId } from '@/utils/app'

interface ProductClientProps {
  initialProduct: GetProductResult
  productId: string
  userId: string
}

export const ProductClient = ({
  initialProduct,
  productId,
}: ProductClientProps) => {
  const locale = useLocale()
  const tTab = useTranslations('ProductTab')
  const tProduct = useTranslations('Products')
  const tBreadcrumb = useTranslations('Common.Breadcrumb')

  const { setProductDetailState } = useProductDetailStore()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId, locale],
    queryFn: async () => getProduct(productId, userId, locale),
    placeholderData: initialProduct,
    enabled: !!productId,
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
        {isLoading ? (
          <Skeleton className='container mx-auto h-5 max-w-72' />
        ) : (
          <Breadcrumbs className='container mx-auto font-semibold'>
            <BreadcrumbItem href='/'>{tBreadcrumb('home')}</BreadcrumbItem>
            <BreadcrumbItem href='/products'>
              {tBreadcrumb('products')}
            </BreadcrumbItem>
            <BreadcrumbItem
              href={`/category/${generateSlugWithId(product?.category?.name!, product?.category?.id!)}`}
            >
              {tProduct('categoryTitle', { name: product?.category?.name! })}
            </BreadcrumbItem>
          </Breadcrumbs>
        )}

        <div className='container mx-auto grid items-start gap-2 md:gap-4 lg:grid-cols-2'>
          <div className='min-w-0 overflow-hidden'>
            <ProductImagePreview
              images={product.images.map((image) => image.url)}
            />
          </div>
          <div className='min-w-0 lg:sticky lg:top-20'>
            <ProductCart />
          </div>
        </div>

        <Tabs className='mx-auto' variant='underlined'>
          <Tab title={tTab('description')}>
            <ProductDescription />
          </Tab>
          <Tab title={tTab('review')}>
            <ProductReview />
          </Tab>
        </Tabs>

        <ProductSimilar />
      </div>
    </section>
  )
}
