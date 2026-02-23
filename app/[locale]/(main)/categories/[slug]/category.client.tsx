'use client'

import { useLocale, useTranslations } from 'next-intl'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductSection } from '@/components/ui/Product/ProductSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { THRESHOLD_SCROLL_FETCH } from '@/constants'
import { useCategory } from '@/features/category/category.hook'
import { useProductsInfinite } from '@/features/product/product.hook'
import { useWindowInfiniteScroll } from '@/hooks/useWindowInfiniteScroll'

interface Props {
  categoryId: string
}

const CategoryClient = ({ categoryId }: Props) => {
  const t = useTranslations('products')
  const tShared = useTranslations('shared')

  const locale = useLocale()

  const { data: category } = useCategory(categoryId)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useProductsInfinite({
      categoryId,
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
    <Container>
      <AppSection>
        <SectionHeader
          description={tShared('categoryDiscovery.description')}
          title={category?.name!}
        />

        <ProductSection items={products} />

        {!isLoading && products.length === 0 && (
          <EmptyState description={t('empty')} />
        )}
      </AppSection>
    </Container>
  )
}

export { CategoryClient }
