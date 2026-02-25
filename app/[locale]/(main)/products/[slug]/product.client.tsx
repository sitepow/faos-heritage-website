'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'

import type { GetProductResult } from '@/features/product/product.types'

import { ProductPreview } from './_components/ProductPreview'
import { ProductSimilar } from './_components/ProductSectionSemilar'
import { ProductTabs } from './_components/ProductTabs'

import { AppSection } from '@/components/layouts/AppSection'
import { AffiliateBanner } from '@/components/ui/AffiliateBanner/AffiliateBanner'
import { DynamicBreadcrumb } from '@/components/ui/DynamicBreadcrumb'
import { CommentSection } from '@/features/comment/ui/CommentSection'
import { useProduct } from '@/features/product/product.hook'
import { useProductMutation } from '@/features/product/product.mutation'
import { useProductDetailStore } from '@/features/product/product.store'
import { ReviewSection } from '@/features/review/ui/ReviewSection'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  initialData: GetProductResult
  slug: string
  userId: string
}

const ProductClient = ({ initialData, slug }: Props) => {
  const { userId } = useAuth()

  const locale = useLocale()
  const tBreadcrumb = useTranslations('navigation.breadcrumb')
  const { setProduct } = useProductDetailStore()

  const { increaseView } = useProductMutation()
  const isIncreased = useRef(false)

  const { data: product } = useProduct({
    locale,
    slug,
    userId,
    initialData,
  })

  useEffect(() => {
    if (product) {
      setProduct(product)
    }
  }, [product, setProduct])

  useEffect(() => {
    if (!isIncreased.current && slug) {
      increaseView(slug)
      isIncreased.current = true
    }
  }, [slug, increaseView])

  const categorySlug = product?.category?.slug
  const categoryName = product?.category?.name

  const breadcrumbItems = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('products'), href: '/products' },
    {
      label: categoryName!,
      href: categorySlug ? `/categories/${categorySlug}` : '#',
    },
    { label: product?.name!, href: '#' },
  ]

  const productId = product?.id || ''

  return (
    <AppSection>
      <nav aria-label='Breadcrumb'>
        <DynamicBreadcrumb items={breadcrumbItems} />
      </nav>

      <article className='flex flex-col gap-10'>
        <ProductPreview />
        <ProductTabs />
      </article>

      <AffiliateBanner />

      <section aria-labelledby='similar-products-title'>
        <ProductSimilar />
      </section>

      {productId && (
        <>
          <section aria-labelledby='reviews-title' id='reviews'>
            <ReviewSection productId={productId} />
          </section>

          <section aria-labelledby='comments-title' id='comments'>
            <CommentSection productId={productId} />
          </section>
        </>
      )}
    </AppSection>
  )
}

export { ProductClient }
