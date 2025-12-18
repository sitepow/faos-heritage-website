'use client'

import { Button } from '@heroui/button'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { FC } from 'react'

import { ProductsSection } from '@/app/(main)/_components/section/products'
import {
  getProducts,
  type GetProductsResult,
} from '@/app/(main)/actions/product'
import { SectionHeader } from '@/components/heading'

interface Props {
  initialProducts: GetProductsResult
  itemPerPage: number
}

const ExploreProducts: FC<Props> = ({ initialProducts, itemPerPage }) => {
  const QUERY = {
    HOMEPAGE: ['products', 'homepage', { limit: itemPerPage }],
  }
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: QUERY.HOMEPAGE,
    queryFn: () => getProducts({ limit: itemPerPage }),
    initialData: initialProducts,
    staleTime: 1000 * 10,
    refetchOnMount: true,
  })

  return (
    <>
      <SectionHeader
        description='Find the perfect product to meet your needs'
        title='Choose products according to your style'
      />
      <ProductsSection
        isLoading={isLoadingProducts}
        itemPerPage={itemPerPage}
        items={products?.items ?? []}
      />
      <Link href='/products'>
        <Button
          color='primary'
          endContent={<ArrowRight className='text-primary' />}
          variant='light'
        >
          Explore Products
        </Button>
      </Link>
    </>
  )
}

export { ExploreProducts }
