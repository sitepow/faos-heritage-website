'use client'

import { Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { ProductSection } from '../product/[slug]/_components/section'

import {
  getProducts,
  type GetProductsResult,
} from '@/app/[locale]/(main)/products/action'
import { SectionHeader } from '@/components/heading'

interface ExploreProductsClientProps {
  initialProducts: GetProductsResult
  itemPerPage: number
}

export const ExploreProductsClient = ({
  initialProducts,
  itemPerPage,
}: ExploreProductsClientProps) => {
  const locale = useLocale()
  const tCategory = useTranslations('CategoryCarousel')
  const tSection = useTranslations('Section')
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', 'homepage', { limit: itemPerPage }, locale],
    queryFn: () => getProducts({ limit: itemPerPage, locale }),
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
        <Button variant='bordered' color='primary' endContent={<ArrowRight />}>
          {tCategory('explore')}
        </Button>
      </Link>
    </>
  )
}
