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
import { useProduct } from '@/features/product/product.hook'
import { useProductMutation } from '@/features/product/product.mutation'
import { useProductDetailStore } from '@/features/product/product.store'
import { useAuth } from '@/hooks/useAuth'
import { generateSlugWithId } from '@/utils'

interface Props {
  initialData: GetProductResult
  productId: string
  userId: string
}

const ProductClient = ({ initialData, productId }: Props) => {
  const { userId } = useAuth()

  const locale = useLocale()
  const tBreadcrumb = useTranslations('navigation.breadcrumb')
  const { setProduct } = useProductDetailStore()

  const { increaseView } = useProductMutation()
  const isIncreased = useRef(false)

  const { data: product } = useProduct({
    locale,
    productId,
    userId,
    initialData,
  })

  useEffect(() => {
    if (product) {
      setProduct(product)
    }
  }, [product, setProduct])

  useEffect(() => {
    if (!isIncreased.current && productId) {
      increaseView(productId)
      isIncreased.current = true
    }
  }, [productId, increaseView])

  const categoryId = product?.category?.id
  const categoryName = product?.category?.name

  const breadcrumbItems = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('products'), href: '/products' },
    {
      label: categoryName!,
      href: `/categories/${generateSlugWithId(categoryId!, categoryName!)}`,
    },
    { label: product?.name!, href: '#' },
  ]

  return (
    <AppSection>
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductPreview />
      <ProductTabs />
      <AffiliateBanner />
      <ProductSimilar />
    </AppSection>
  )
}

export { ProductClient }
