'use client'

import { useLocale, useTranslations } from 'next-intl'

import { useProductDetailStore } from '../store'

import { ProductSection } from '@/components/ui/Product/ProductSection'
import { PAGINATION } from '@/constants/app'
import { useSimilarProducts } from '@/features/product/useProduct'

const ProductSimilar = () => {
  const locale = useLocale()
  const translate = useTranslations('Section')

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
    <section className='flex flex-col gap-4'>
      <h2 className='mx-auto w-fit pb-1 text-xl font-semibold'>
        {translate('similar')}
      </h2>

      <ProductSection
        isLoading={isLoadingProducts}
        itemPerPage={PAGINATION.ITEMS_PER_PAGE}
        items={items}
      />
    </section>
  )
}

export { ProductSimilar }
