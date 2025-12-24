'use client'

import { Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { ProductSection } from './product'

import {
  getProducts,
  type GetProductsResult,
} from '@/app/(main)/products/action'
import { SectionHeader } from '@/components/common/heading'

interface ExploreProductsClientProps {
  initialProducts: GetProductsResult
  itemPerPage: number
}

export const ExploreProductsClient = ({
  initialProducts,
  itemPerPage,
}: ExploreProductsClientProps) => {
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
        description='Find the perfect product to meet your needs'
        title='Choose products according to your style'
      />
      <ProductSection
        isLoading={isLoadingProducts}
        itemPerPage={itemPerPage}
        items={products?.items ?? []}
      />
      <Link href='/products'>
        <Button
          className='text-white'
          color='primary'
          endContent={<ArrowRight />}
        >
          Explore Products
        </Button>
      </Link>
    </>
  )
}
