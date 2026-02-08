'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'

import type { GetProductResult } from '@/features/product/product.types'

import { ProductPreview } from './_components/ProductPreview'
import { ProductSimilar } from './_components/ProductSectionSemilar'
import { ProductTabs } from './_components/ProductTabs'

import DynamicBreadcrumb from '@/components/ui/DynamicBreadcrumb'
import { useProductDetailStore } from '@/features/product/product.store'
import { useProduct } from '@/features/product/useProduct'
import { useUser } from '@/hooks/useUser'
import { generateSlugWithId } from '@/utils'

interface ProductClientProps {
  initialData: GetProductResult
  productId: string
  userId: string
}

const ProductClient = ({ initialData, productId }: ProductClientProps) => {
  const { userId } = useUser()

  const locale = useLocale()
  const translateBreadcrumb = useTranslations('navigation.breadcrumb')
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
    { label: translateBreadcrumb('home'), href: '/' },
    { label: translateBreadcrumb('products'), href: '/products' },
    {
      label: categoryName!,
      href: `/categories/${generateSlugWithId(categoryId!, categoryName!)}`,
    },
  ]

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex w-full flex-col gap-5 p-5'>
        <DynamicBreadcrumb
          className='container mx-auto font-semibold'
          items={breadcrumbItems}
        />
        <ProductPreview />
        <ProductTabs />
        <ProductSimilar />
      </div>
    </section>
  )
}

export { ProductClient }
