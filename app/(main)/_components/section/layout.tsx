'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type FC } from 'react'

import type { GetProductsResult } from '@/actions/product'
import type { GetCategoriesResult } from '@/app/(dashboard)/dashboard/product/actions/category'

import { CategoryCard, CategoryCardSkeleton } from '../card/category'
import { ProductCard, ProductCardSkeleton } from '../card/product'

import { getProducts } from '@/actions/product'
import { getCategories } from '@/app/(dashboard)/dashboard/product/actions/category'
import { Carousel } from '@/components/carousel'
import { createSlug } from '@/utils/helper'

interface Props {
  initialCategories: GetCategoriesResult
  initialProducts: GetProductsResult
  itemPerPage: number
}

const CategoryLayout: FC<Props> = ({
  initialCategories,
  initialProducts,
  itemPerPage,
}) => {
  const router = useRouter()

  const [currentCategory, setCurrentCategory] = useState<{
    id?: string
    label?: string
  }>({})

  const QUERY = {
    CAROUSEL_PRODUCTS: ['carousel', 'products', currentCategory.id],
    CATEGORIES: ['dashboard', 'categories', 'modal'],
  }

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: QUERY.CATEGORIES,
    queryFn: () => getCategories(),
    initialData: initialCategories,
  })

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: QUERY.CAROUSEL_PRODUCTS,
    queryFn: () =>
      getProducts({ limit: itemPerPage, categoryId: currentCategory?.id }),
    enabled: !!currentCategory?.id,
    initialData:
      currentCategory?.id === initialCategories?.[0]?.id
        ? initialProducts
        : undefined,
  })

  useEffect(() => {
    if (!isLoadingCategories && categories) {
      setCurrentCategory({
        id: categories?.[0]?.id,
        label: categories?.[0]?.name,
      })
    }
  }, [categories, isLoadingCategories])

  if (!isLoadingCategories && categories?.length === 0) {
    return
  }

  return (
    <div className='flex w-full flex-col items-stretch gap-5 md:flex md:min-h-[500px] md:flex-row'>
      <Card className='h-[350px] md:h-auto md:w-[400px]'>
        <CardHeader>
          <span className='font-bold'>Products by category</span>
        </CardHeader>
        <CardBody>
          <ScrollShadow className='p-1'>
            <div className='space-y-1'>
              {isLoadingCategories &&
                [...Array(4)].map((_) => <CategoryCardSkeleton key={_} />)}

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

      {!currentCategory?.id && <Card fullWidth />}

      {currentCategory?.id && (
        <Card fullWidth className='size-full h-auto'>
          {currentCategory.id && (
            <CardHeader>
              <div className='flex w-full flex-wrap items-center justify-between'>
                <span className='font-bold'>{currentCategory.label}</span>

                <Button
                  className='bg-white text-primary dark:bg-divider'
                  color='primary'
                  variant='bordered'
                  onPress={() => {
                    router.push(
                      `/category/${createSlug(currentCategory.label!, currentCategory.id!)}`,
                    )
                  }}
                >
                  Explore all products
                </Button>
              </div>
            </CardHeader>
          )}

          <CardBody>
            <Carousel slidesToScroll className='items-stretch'>
              {isLoadingProducts &&
                [...Array(8)].map((_) => <ProductCardSkeleton key={_} />)}

              {!isLoadingProducts && products?.items?.length === 0 && (
                <div className='flex w-full flex-col items-center justify-center gap-2 text-center text-default-500'>
                  <AlertCircleIcon className='size-8' />
                  <span>
                    No products found in this category.
                    <br />
                    Please select another category to view other items.
                  </span>
                </div>
              )}

              {!isLoadingProducts &&
                products?.items?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </Carousel>
          </CardBody>
        </Card>
      )}
    </div>
  )
}

export { CategoryLayout }
