/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */

'use client'

import { Card, CardHeader, CardBody, ScrollShadow, Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'

import type { GetCategoriesResult } from '@/app/(dashboard)/dashboard/product/action/category'
import type { GetProductsResult } from '@/app/(main)/products/action'

import { CategoryCarouselItem } from './item'
import {
  ProductCard,
  ProductCardSkeleton,
} from '../../product/[slug]/components/card'

import { getCategories } from '@/app/(dashboard)/dashboard/product/action/category'
import { getProducts } from '@/app/(main)/products/action'
import { Carousel } from '@/components/features/carousel/carousel'
import { createSlug } from '@/utils/slug'

interface CategoryCarouselClientProps {
  initialCategories: GetCategoriesResult
  initialProducts: GetProductsResult
  itemPerPage: number
}

const EmptyState = () => (
  <div className='text-default-500 flex w-full flex-col items-center justify-center gap-2 py-10 text-center'>
    <AlertCircleIcon className='size-8' />
    <p>
      No products found in this category.
      <br />
      Please select another category.
    </p>
  </div>
)

export const CategoryCarouselClient = ({
  initialCategories,
  initialProducts,
  itemPerPage,
}: CategoryCarouselClientProps) => {
  const router = useRouter()

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
    ],
    queryFn: () =>
      getProducts({ limit: itemPerPage, categoryId: activeCategory?.id }),
    enabled: !!activeCategory?.id,
    initialData:
      activeCategory?.id === initialCategories?.[0]?.id
        ? initialProducts
        : undefined,
  })

  if (!categories?.length) return null

  return (
    <div className='flex w-full flex-col gap-5 md:min-h-[525px] md:flex-row'>
      <Card className='h-[350px] md:h-[525px] md:w-[400px]'>
        <CardHeader className='font-bold'>Products by category</CardHeader>
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

      <Card fullWidth className='h-[525px]'>
        <CardHeader className='flex flex-wrap items-center justify-between'>
          <span className='font-bold'>{activeCategory?.name}</span>
          <Button
            className='text-secondary'
            color='primary'
            endContent={<ArrowRight className='size-4' />}
            onPress={() =>
              router.push(
                `/category/${createSlug(activeCategory?.name!, activeCategory?.id!)}`,
              )
            }
          >
            Explore Products
          </Button>
        </CardHeader>

        <CardBody>
          <Carousel slidesToScroll trackClassName='items-stretch p-1'>
            {isLoadingProducts ? (
              Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            ) : products?.items?.length === 0 ? (
              <EmptyState />
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
