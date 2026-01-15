/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
'use client'

import { Card, CardHeader, CardBody, Button } from '@heroui/react'
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
    // <div className='container mx-auto flex w-full flex-col gap-5 sm:h-[710px] md:flex-row'>
    //   <div>
    //     <div className='space-y-1'>
    //       {categories.map((category) => (
    //         <CategoryCarouselItem
    //           key={category.id}
    //           isActive={activeCategory?.id === category.id}
    //           item={category}
    //           onClick={() => setSelectedId(category.id)}
    //           onMouseEnter={() => setSelectedId(category.id)}
    //         />
    //       ))}
    //     </div>
    //   </div>

    //   <
    // </div>

    <div className='container mx-auto flex flex-col'>
      <div className='flex flex-wrap justify-center gap-5'>
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

      <Card
        fullWidth
        shadow='none'
        className='container mx-auto min-h-[525px] w-full'
      >
        <CardHeader className='flex flex-wrap items-center justify-between'>
          <span className='text-xl font-semibold sm:text-2xl'>
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
