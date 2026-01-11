/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
'use client'

import { Card, CardHeader, CardBody, ScrollShadow, Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'

import type { GetCategoriesResult } from '@/app/[locale]/(dashboard)/dashboard/product/action/category'
import type { GetProductsResult } from '@/app/[locale]/(main)/products/action'

import { CategoryCarouselItem } from './item'
import {
  ProductCard,
  ProductCardSkeleton,
} from '../../product/[slug]/_components/card'

import { getCategories } from '@/app/[locale]/(dashboard)/dashboard/product/action/category'
import { getProducts } from '@/app/[locale]/(main)/products/action'
import { Carousel } from '@/components/carousel/carousel'
import { createSlug } from '@/utils/helpers/slug'
interface Props {
  initialCategories: GetCategoriesResult
  initialProducts: GetProductsResult
  itemPerPage: number
}

const EmptyState = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <div className='text-default-500 flex w-full flex-col items-center justify-center gap-2 py-10 text-center'>
    <AlertCircleIcon className='size-8' />
    <p>
      {title}
      <br />
      {description}
    </p>
  </div>
)

export const CategoryCarouselClient = ({
  initialCategories,
  initialProducts,
  itemPerPage,
}: Props) => {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('CategoryCarousel')
  const tProduct = useTranslations('Products')

  const [selectedId, setSelectedId] = useState<string | undefined>(
    initialCategories?.[0]?.id,
  )

  const { data: categories } = useQuery({
    queryKey: ['dashboard', 'categories', 'modal'],
    queryFn: () => getCategories(),
    initialData: initialCategories,
  })

  const activeCategory = useMemo(
    () => categories?.find((c) => c.id === selectedId) || categories?.[0],
    [categories, selectedId],
  )

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: [
      'carousel',
      'products',
      { categoryId: activeCategory?.id, limit: itemPerPage },
      locale,
    ],
    queryFn: () =>
      getProducts({
        limit: itemPerPage,
        categoryId: activeCategory?.id,
        locale,
      }),
    enabled: !!activeCategory?.id,
    initialData:
      activeCategory?.id === initialCategories?.[0]?.id
        ? initialProducts
        : undefined,
  })

  if (!categories?.length) {
    return null
  }

  return (
    <div className='flex w-full flex-col gap-5 sm:h-[710px] md:flex-row'>
      <Card className='h-[350px] sm:h-full md:h-full md:w-[400px]'>
        <CardHeader className='font-bold'>{t('title')}</CardHeader>
        <CardBody>
          <ScrollShadow className='p-1'>
            <div className='space-y-1'>
              {categories.map((category) => (
                <CategoryCarouselItem
                  key={category.id}
                  isActive={activeCategory?.id === category.id}
                  item={category}
                  onClick={() => setSelectedId(category.id)}
                  onMouseEnter={() => setSelectedId(category.id)}
                />
              ))}
            </div>
          </ScrollShadow>
        </CardBody>
      </Card>

      <Card fullWidth className='min-h-[525px]'>
        <CardHeader className='flex flex-wrap items-center justify-between'>
          <span className='font-bold'>
            {tProduct('categoryTitle', { name: activeCategory?.name! })}
          </span>
          <Button
            variant='bordered'
            color='primary'
            endContent={<ArrowRight className='size-4' />}
            onPress={() =>
              router.push(
                `/category/${createSlug(activeCategory?.name!, activeCategory?.id!)}`,
              )
            }
          >
            {t('explore')}
          </Button>
        </CardHeader>

        <CardBody>
          <Carousel slidesToScroll trackClassName='items-stretch'>
            {isLoadingProducts ? (
              Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : products?.items?.length === 0 ? (
              <EmptyState
                title={t('empty.title')}
                description={t('empty.description')}
              />
            ) : (
              products?.items?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </Carousel>
        </CardBody>
      </Card>
    </div>
  )
}
