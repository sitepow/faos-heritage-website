'use client'

import { Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { ProductSection } from '../product'

import {
  getProducts,
  type GetProductsResult,
} from '@/app/[locale]/(main)/products/action'
import { SectionHeader } from '@/components/common/heading'

interface ExploreProductsClientProps {
  initialProducts: GetProductsResult
  itemPerPage: number
}

export const ExploreProductsClient = ({
  initialProducts,
  itemPerPage,
}: ExploreProductsClientProps) => {
  const tCategory = useTranslations('CategoryCarousel')
  const tSection = useTranslations('Section')
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', 'homepage', { limit: itemPerPage }],
    queryFn: () => getProducts({ limit: itemPerPage }),
    initialData: initialProducts,
    refetchOnMount: true,
  })

  if (products?.items?.length === 0) {
    return
  }

  return (
    <>
      <SectionHeader
        description={tSection('Header.description')}
        title={tSection('Header.title')}
      />
      <ProductSection
        isLoading={isLoadingProducts}
        itemPerPage={itemPerPage}
        items={products?.items ?? []}
      />
      <Link href='/products'>
        <Button
          className='text-secondary'
          color='primary'
          endContent={<ArrowRight />}
        >
          {tCategory('explore')}
        </Button>
      </Link>
    </>
  )
}
