'use client'

import { useQuery } from '@tanstack/react-query'

import { ProductSection } from './section'
import { useProductDetailStore } from '../store'

import { getProducts } from '@/app/[locale]/(main)/products/action'
import { ITEM_PER_PAGE } from '@/utils/constants'

export const ProductSimilar = () => {
  const { product } = useProductDetailStore()
  const categoryId = product?.categoryId

  const QUERY_KEY = {
    SIMILAR: ['similarProducts', categoryId],
  }

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY.SIMILAR,
    queryFn: () => getProducts({ limit: ITEM_PER_PAGE, categoryId }),
    enabled: !!categoryId,
  })

  const similars =
    data?.items?.filter((similar) => similar.id !== product?.id) ?? []

  return (
    <div className='flex flex-col gap-4'>
      {similars?.length !== 0 && (
        <span className='border-primary mx-auto w-fit border-b pb-1 text-xl font-bold'>
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
