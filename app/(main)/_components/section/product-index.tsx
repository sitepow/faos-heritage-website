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

const ProductIndex: FC<Props> = ({ initialProducts, itemPerPage }) => {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', 'index', itemPerPage],
    queryFn: () => getProducts({ limit: itemPerPage }),
    initialData: initialProducts,
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
          endContent={<ArrowRight className='text-default-500' />}
          variant='faded'
        >
          Explore all products
        </Button>
      </Link>
    </>
  )
}

export { ProductIndex }
