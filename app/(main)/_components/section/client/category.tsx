'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import type { GetProductsResult } from '@/actions/product'
import { getProducts } from '@/actions/product'
import type { GetCategoriesResult } from '@/app/(dashboard)/dashboard/product/actions/category'
import { getCategories } from '@/app/(dashboard)/dashboard/product/actions/category'
import { Carousel } from '@/components/carousel'
import { createSlug } from '@/utils/helper'
import { Skeleton } from '@heroui/skeleton'
import { CategoryCard, CategoryCardSkeleton } from '../../card/category'
import { ProductCard, ProductCardSkeleton } from '../../card/product'

interface Props {
  initialCategories: GetCategoriesResult
  initialProducts: GetProductsResult
  itemPerPage: number
}

const CategorySectionClient: FC<Props> = ({ initialCategories, initialProducts, itemPerPage }) => {
  const router = useRouter()

  const [currentCategory, setCurrentCategory] = useState<{
    id?: string
    label?: string
  }>({})

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['dashboard', 'modal', 'categories'],
    queryFn: () => getCategories(),
    initialData: initialCategories,
  })

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', 'carousel', currentCategory.id],
    queryFn: () => getProducts({ limit: itemPerPage, categoryId: currentCategory.id }),
    enabled: !!currentCategory.id,
    initialData: currentCategory.id === initialCategories?.[0]?.id ? initialProducts : undefined,
  })

  useEffect(() => {
    if (!isLoadingCategories && categories) {
      setCurrentCategory({
        id: categories[0].id,
        label: categories[0].name,
      })
    }
  }, [categories, isLoadingCategories])

  return (
    <div className='flex w-full flex-col gap-5 md:flex md:h-[500px] md:flex-row'>
      <Card className='h-[350px] md:h-[500px] md:w-[400px]'>
        <CardHeader>
          <span className='font-bold'>สินค้าตามหมวดหมู่</span>
        </CardHeader>
        <CardBody>
          <ScrollShadow className='p-1'>
            <div className='space-y-1'>
              {isLoadingCategories && [...Array(4)].map((_) => <CategoryCardSkeleton key={_} />)}

              {!isLoadingCategories && categories?.length === 0 && <span>ไม่พบหมวดหมู่สินค้า</span>}

              {!isLoadingCategories &&
                (categories ?? []).map((category) => (
                  <CategoryCard
                    key={category.id}
                    isActive={currentCategory.id === category.id}
                    item={category}
                    onClick={() =>
                      setCurrentCategory({
                        id: category.id,
                        label: category.name,
                      })
                    }
                    onMouseEnter={() =>
                      setCurrentCategory({
                        id: category.id,
                        label: category.name,
                      })
                    }
                  />
                ))}
            </div>
          </ScrollShadow>
        </CardBody>
      </Card>

      {!currentCategory?.id && <Skeleton className='size-full rounded-xl' />}

      {currentCategory?.id && (
        <Card fullWidth className='size-full'>
          {currentCategory.id && (
            <CardHeader>
              <div className='flex w-full items-center justify-between'>
                <span className='font-bold'>{currentCategory.label}</span>

                <Button
                  variant='light'
                  onPress={() => {
                    router.push(
                      `/category/${createSlug(currentCategory.label!, currentCategory.id!)}`,
                    )
                  }}
                >
                  ดูทั้งหมด
                </Button>
              </div>
            </CardHeader>
          )}

          <CardBody>
            <Carousel slidesToScroll className='items-center'>
              {isLoadingProducts && [...Array(8)].map((_) => <ProductCardSkeleton key={_} />)}

              {!isLoadingProducts && products?.items?.length === 0 && (
                <div className='flex w-full flex-col items-center justify-center gap-2 text-default-500'>
                  <AlertCircleIcon className='size-8' />
                  <span>ไม่พบสินค้าในหมวดหมู่นี้</span>
                </div>
              )}

              {!isLoadingProducts &&
                products?.items?.map((product) => <ProductCard key={product.id} {...product} />)}

              {currentCategory.id && products?.items?.length !== 0 && (
                <Button
                  variant='faded'
                  onPress={() => {
                    router.push(
                      `/category/${createSlug(currentCategory.label!, currentCategory.id!)}`,
                    )
                  }}
                >
                  ดูทั้งหมด
                </Button>
              )}
            </Carousel>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

export { CategorySectionClient }
