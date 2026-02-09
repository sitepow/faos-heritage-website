'use client'

import { Button } from '@heroui/react'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import type { GetProductsInfiniteResult } from '@/features/product/product.types'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { ProductSection } from '@/components/ui/Product/ProductSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PAGINATION } from '@/constants'
import { useProducts } from '@/features/product/useProduct'

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
    <Container>
      <AppSection>
        <SectionHeader
          description={tShared('productDiscovery.description')}
          title={tShared('productDiscovery.title')}
        />

        <ProductSection
          isLoading={isProductsLoading}
          itemPerPage={itemsPerPage}
          items={products.items}
        />

        <Link className='mx-auto' href='/products'>
          <Button
            className='text-secondary'
            color='primary'
            endContent={<ArrowRightIcon />}
            radius='sm'
          >
            {tActions('more')}
          </Button>
        </Link>
      </AppSection>
    </Container>
  )
}

export { ProductExploreSection }
