'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'

import type { GetProductResult } from '@/features/product/product.types'

import { ProductPreview } from './_components/ProductPreview'
import { ProductSimilar } from './_components/ProductSectionSemilar'
import { ProductTabs } from './_components/ProductTabs'

import { AppSection } from '@/components/layouts/AppSection'
import { DynamicBreadcrumb } from '@/components/ui/DynamicBreadcrumb'
import { useProductDetailStore } from '@/features/product/product.store'
import { useProduct } from '@/features/product/useProduct'
import { useAuth } from '@/hooks/useAuth'
import { generateSlugWithId } from '@/utils'

interface ProductClientProps {
  initialData: GetProductResult
  productId: string
  userId: string
}

const ProductClient = ({ initialData, productId }: ProductClientProps) => {
  const { userId } = useAuth()

  const locale = useLocale()
  const tBreadcrumb = useTranslations('navigation.breadcrumb')
  const { setProduct } = useProductDetailStore()

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

  const categoryId = product?.category?.id
  const categoryName = product?.category?.name

  const breadcrumbItems = [
    { label: tBreadcrumb('home'), href: '/' },
    { label: tBreadcrumb('products'), href: '/products' },
    {
      label: categoryName!,
      href: `/categories/${generateSlugWithId(categoryId!, categoryName!)}`,
    },
  ]

  return (
    <AppSection>
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductPreview />
      <ProductTabs />
      <ProductSimilar />
    </AppSection>
  )
}

export { ProductClient }
