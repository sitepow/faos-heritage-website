'use client'

import { Button } from '@heroui/react'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import type { GetProductsInfiniteResult } from '@/features/product/product.action'

import { ProductSection } from '@/components/ui/Product/ProductSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PAGINATION } from '@/constants'
import { useProducts } from '@/features/product/useProduct'

interface ProductExploreSectionProps {
  initialData: GetProductsInfiniteResult
  itemsPerPage: number
}

const ProductExploreSection = ({
  initialData,
  itemsPerPage,
}: ProductExploreSectionProps) => {
  const locale = useLocale()

  const translateShared = useTranslations('shared')
  const translateActions = useTranslations('actions')

  const { data: products, isLoading: isProductsLoading } = useProducts({
    locale,
    itemsPerPage: PAGINATION.ITEMS_PER_PAGE,
    initialData,
  })

  if (!products?.items?.length) {
    return null
  }

  return (
    <section className='container mx-auto flex flex-col gap-6'>
      <SectionHeader
        description={translateShared('productDiscovery.description')}
        title={translateShared('productDiscovery.title')}
      />

      <ProductSection
        isLoading={isProductsLoading}
        itemPerPage={itemsPerPage}
        items={products.items}
      />

      <div className='flex justify-center'>
        <Link href='/products'>
          <Button
            className='text-secondary'
            color='primary'
            endContent={<ArrowRightIcon />}
            radius='sm'
          >
            {translateActions('more')}
          </Button>
        </Link>
      </div>
    </section>
  )
}

export { ProductExploreSection }
