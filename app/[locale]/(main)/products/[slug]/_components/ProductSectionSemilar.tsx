'use client'

import { useLocale, useTranslations } from 'next-intl'

import { ProductSection } from '@/components/ui/Product/ProductSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PAGINATION } from '@/constants'
import { useSimilarProducts } from '@/features/product/hook'
import { useProductDetailStore } from '@/features/product/store'

const ProductSimilar = () => {
  const locale = useLocale()
  const tRelatedProducts = useTranslations('shared.relatedProducts')

  const { product } = useProductDetailStore()

  const { data: products, isLoading: isLoadingProducts } = useSimilarProducts({
    locale,
    categoryId: product?.categoryId,
    excludeProductId: product?.id,
    limit: PAGINATION.ITEMS_PER_PAGE,
  })

  const items = products?.items ?? []

  if (items.length === 0) {
    return null
  }

  return (
    <section className='flex flex-col gap-6' id='similar-products'>
      <SectionHeader
        description={tRelatedProducts('description')}
        id='similar-products-title'
        title={tRelatedProducts('title')}
      />
      <ProductSection
        isLoading={isLoadingProducts}
        itemPerPage={PAGINATION.ITEMS_PER_PAGE}
        items={items}
      />
    </section>
  )
}

export { ProductSimilar }
