'use client'

import { useLocale, useTranslations } from 'next-intl'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductSection } from '@/components/ui/Product/ProductSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { THRESHOLD_SCROLL_FETCH } from '@/constants'
import { useCategoryBySlug } from '@/features/category/category.hook'
import { useProductsInfinite } from '@/features/product/product.hook'
import { useWindowInfiniteScroll } from '@/hooks/useWindowInfiniteScroll'

interface Props {
  slug: string
}

const CategoryClient = ({ slug }: Props) => {
  const locale = useLocale()
  const t = useTranslations('products')
  const tShared = useTranslations('shared')

  const { data: category } = useCategoryBySlug({
    slug,
    locale,
  })

  const categoryId = category?.id

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useProductsInfinite({
      categoryId: categoryId!,
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
          as='h1'
          description={tShared('categoryDiscovery.description')}
          title={category?.name || '...'}
        />

        <ProductSection items={products} />

        {!isLoading && products.length === 0 && categoryId && (
          <EmptyState description={t('empty')} />
        )}
      </AppSection>
    </Container>
  )
}

export { CategoryClient }
