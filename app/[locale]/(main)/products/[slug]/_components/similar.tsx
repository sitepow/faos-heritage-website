'use client'

import { useQuery } from '@tanstack/react-query'
import { useLocale, useTranslations } from 'next-intl'

import { ProductSection } from './section'
import { useProductDetailStore } from '../store'

import { getProducts } from '@/app/[locale]/(main)/products/action'
import { PAGINATION } from '@/constants/app'

export const ProductSimilar = () => {
  const locale = useLocale()
  const t = useTranslations('Section')
  const { product } = useProductDetailStore()
  const categoryId = product?.categoryId

  const QUERY_KEY = {
    SIMILAR: ['similarProducts', categoryId, locale],
  }

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY.SIMILAR,
    queryFn: () =>
      getProducts({ limit: PAGINATION.ITEMS_PER_PAGE, categoryId, locale }),
    enabled: !!categoryId,
  })

  const similars =
    data?.items?.filter((similar) => similar.id !== product?.id) ?? []

  return (
    <div className='flex flex-col gap-4'>
      {similars?.length !== 0 && (
        <span className='mx-auto w-fit pb-1 text-xl font-semibold'>
          {t('similar')}
        </span>
      )}

      <ProductSection
        isLoading={isLoading}
        itemPerPage={PAGINATION.ITEMS_PER_PAGE}
        items={similars}
      />
    </div>
  )
}
