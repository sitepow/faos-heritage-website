'use client'

import { Button } from '@heroui/react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import type { GetProductsInfiniteResult } from '@/features/product/types'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { ProductSection } from '@/components/ui/Product/ProductSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PAGINATION } from '@/constants'
import { useProducts } from '@/features/product/hook'

interface Props {
  initialData: GetProductsInfiniteResult
  itemsPerPage: number
}

const ProductExploreSection = ({ initialData, itemsPerPage }: Props) => {
  const locale = useLocale()
  const tShared = useTranslations('shared')
  const tActions = useTranslations('actions')

  const { data: products, isLoading: isProductsLoading } = useProducts({
    locale,
    itemsPerPage: PAGINATION.ITEMS_PER_PAGE,
    initialData,
  })

  if (!products?.items?.length) {
    return null
  }

  return (
    <AppSection>
      <Container className='flex flex-col gap-10'>
        <SectionHeader
          description={tShared('productDiscovery.description')}
          title={tShared('productDiscovery.title')}
        />

        <Link className='mx-auto' href='/products'>
          <Button variant='faded'>{tActions('more')}</Button>
        </Link>

        <ProductSection
          isLoading={isProductsLoading}
          itemPerPage={itemsPerPage}
          items={products.items}
        />
      </Container>
    </AppSection>
  )
}

export { ProductExploreSection }
