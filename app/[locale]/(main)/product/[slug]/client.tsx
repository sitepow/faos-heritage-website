'use client'

import { BreadcrumbItem, Breadcrumbs, Skeleton, Tab, Tabs } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'

import type { GetProductResult } from '@/app/[locale]/(dashboard)/dashboard/product/action/product'

import { ProductCart } from './_components/cart'
import { ProductDescription } from './_components/description'
import { ProductImagePreview } from './_components/image-preview'
import { ProductReview } from './_components/review'
import { ProductSimilar } from './_components/similar'
import { useProductDetailStore } from './store'

import { getProduct } from '@/app/[locale]/(dashboard)/dashboard/product/action/product'
import { AdvertiseBanner } from '@/components/banner/advertise'
import { CertificateBanner } from '@/components/banner/certificate'
import { CustomerBanner } from '@/components/banner/customer'
import { MarketplaceBanner } from '@/components/banner/marketplace'
import { Country } from '@/components/navbar/country'
import { PageNotFound } from '@/components/page-not-found'
import { createSlug } from '@/utils/helpers/slug'
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
    return <PageNotFound>Product not found</PageNotFound>
  }

  return (
    <section className='flex flex-col gap-4'>
      <div className='container mx-auto flex w-full justify-start'>
        <Country />
      </div>

      {isLoading ? (
        <Skeleton className='container mx-auto h-5 max-w-72' />
      ) : (
        <Breadcrumbs className='container mx-auto font-semibold'>
          <BreadcrumbItem href='/'>{tBreadcrumb('home')}</BreadcrumbItem>
          <BreadcrumbItem href='/products'>
            {tBreadcrumb('products')}
          </BreadcrumbItem>
          <BreadcrumbItem
            href={`/category/${createSlug(product?.category?.name!, product?.category?.id!)}`}
          >
            {tProduct('categoryTitle', { name: product?.category?.name! })}
          </BreadcrumbItem>
          {/* <BreadcrumbItem>{product.name}</BreadcrumbItem> */}
        </Breadcrumbs>
      )}

      <div className='container mx-auto grid items-start gap-2 lg:grid-cols-2'>
        <div className='lg:sticky lg:top-20'>
          <ProductImagePreview
            images={product.images.map((image) => image.url)}
          />
        </div>
        <div className='min-w-0 lg:sticky lg:top-20'>
          <ProductCart />
        </div>
      </div>

      <Tabs className='mx-auto' variant='bordered'>
        <Tab title={tTab('description')}>
          <ProductDescription />
        </Tab>
        <Tab title={tTab('review')}>
          <ProductReview />
        </Tab>
      </Tabs>

      {/* <CertificateBanner /> */}
      {/* <AdvertiseBanner /> */}
      <ProductSimilar />
      {/* <CustomerBanner /> */}

      <div className='flex w-full flex-col'>
        <AdvertiseBanner />
        <CertificateBanner />
        <MarketplaceBanner />
        <CustomerBanner />
      </div>
    </section>
  )
}
