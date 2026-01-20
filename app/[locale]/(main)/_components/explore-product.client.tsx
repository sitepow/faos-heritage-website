'use client'

import { Button, Card, CardHeader } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { ProductSection } from '../product/[slug]/_components/section'

import {
  getProducts,
  type GetProductsResult,
} from '@/app/[locale]/(main)/products/action'

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
    <div className='container mx-auto flex flex-col gap-5'>
      <Card radius='none' shadow='none'>
        <CardHeader className='border-primary border-b-4 py-5'>
          <div className='text-primary mx-auto flex flex-col items-center'>
            <span className='text-xl font-bold sm:text-2xl'>
              {tSection('Header.title')}
            </span>
            <span>{tSection('Header.description')}</span>
          </div>
        </CardHeader>
      </Card>

      <ProductSection
        isLoading={isLoadingProducts}
        itemPerPage={itemPerPage}
        items={products?.items ?? []}
      />
      <Link href='/products'>
        <Button variant='faded' radius='sm' endContent={<ArrowRightIcon />}>
          {tCategory('explore')}
        </Button>
      </Link>
    </div>
  )
}
