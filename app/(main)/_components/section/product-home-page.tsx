'use client'

import { Button } from '@heroui/button'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { FC } from 'react'

import { Header } from './header'
import { ProductSection } from './product'

import { getProducts, type GetProductsResult } from '@/actions/product'

interface Props {
  initialProducts: GetProductsResult
  itemPerPage: number
}

const ProductHomePage: FC<Props> = ({ initialProducts, itemPerPage }) => {
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
      <Header
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
          className='bg-white text-primary dark:bg-divider'
          color='primary'
          endContent={<ArrowRight className='text-primary' />}
          variant='bordered'
        >
          Explore all products
        </Button>
      </Link>
    </>
  )
}

export { ProductHomePage }
