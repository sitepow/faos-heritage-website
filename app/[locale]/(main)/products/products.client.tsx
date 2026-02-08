'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Container } from '@/components/layouts/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductSection } from '@/components/ui/Product/ProductSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { THRESHOLD_SCROLL_FETCH } from '@/constants'
import { useProductsInfinite } from '@/features/product/useProduct'
import { useWindowInfiniteScroll } from '@/hooks/useWindowInfiniteScroll'

const ProductsClient = () => {
  const t = useTranslations('products')
  const tShared = useTranslations('shared')
  const locale = useLocale()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useProductsInfinite({
      locale,
      itemsPerPage: 12,
    })

  useWindowInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: THRESHOLD_SCROLL_FETCH,
  })

  const products = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <Container className='flex flex-col gap-5'>
      <SectionHeader
        description={tShared('categoryDiscovery.description')}
        title={t('title')}
      />

      <ProductSection items={products} />

      {!isLoading && products.length === 0 && (
        <EmptyState description={t('empty')} />
      )}
    </Container>
  )
}

export { ProductsClient }
