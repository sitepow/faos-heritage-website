'use client'

import { useQuery } from '@tanstack/react-query'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/actions/product'
import type { FC } from 'react'

import { getProducts } from '@/actions/product'
import { ProductSection } from '@/app/(main)/_components/section/product'

const ITEM_PER_PAGE = 8

interface Props {
  product?: GetProductResult
}

const SimilarSection: FC<Props> = ({ product }) => {
  const categoryId = product?.categoryId

  const QUERY = {
    SIMILAR: ['similarProducts', categoryId],
  }

  const { data, isLoading } = useQuery({
    queryKey: QUERY.SIMILAR,
    queryFn: () => getProducts({ limit: ITEM_PER_PAGE, categoryId }),
    enabled: !!categoryId,
  })

  const similars =
    data?.items?.filter((similar) => similar.id !== product?.id) ?? []

  return (
    <div className='flex flex-col gap-4'>
      {similars?.length !== 0 && (
        <span className='mx-auto w-fit border-b border-primary-website pb-1 text-xl font-bold'>
          Similar/Replacement Products
        </span>
      )}

      <ProductSection
        isLoading={isLoading}
        itemPerPage={ITEM_PER_PAGE}
        items={similars}
      />
    </div>
  )
}

export { SimilarSection }
