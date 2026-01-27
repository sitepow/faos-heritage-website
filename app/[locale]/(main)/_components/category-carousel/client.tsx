'use client'

import { Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useMemo } from 'react'

import type { GetCategoriesResult } from '@/app/[locale]/(dashboard)/dashboard/product/action/category'
import type { GetProductsResult } from '@/app/[locale]/(main)/products/action'

import { CategoryCarouselItem } from './item'
import { ProductCard } from '../../product/[slug]/_components/card'

import { getCategories } from '@/app/[locale]/(dashboard)/dashboard/product/action/category'
import { getProducts } from '@/app/[locale]/(main)/products/action'
import { Carousel } from '@/components/ui/Carousel/Carousel'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { createSlug } from '@/utils/slug'
interface Props {
  initialCategories: GetCategoriesResult
  initialProducts: GetProductsResult
  itemPerPage: number
}

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

  const { data: products } = useQuery({
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
    <div className='container mx-auto flex flex-col gap-5'>
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

      {products?.items?.length !== 0 && (
        <div className='container mx-auto flex w-full flex-col gap-5'>
          <div className='flex flex-wrap items-center justify-center gap-5 sm:justify-between'>
            <SectionHeader
              title={tProduct('categoryTitle', { name: activeCategory?.name! })}
            />

            <Button
              variant='bordered'
              color='primary'
              endContent={<ArrowRightIcon className='size-4' />}
              onPress={() =>
                router.push(
                  `/category/${createSlug(activeCategory?.name!, activeCategory?.id!)}`,
                )
              }
            >
              {t('explore')}
            </Button>
          </div>

          <div>
            <Carousel slidesToScroll trackClassName='items-stretch'>
              {products?.items?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  )
}
