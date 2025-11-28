'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { CategoryCard } from '../card/category'
import { ProductCard, ProductCardSkeleton } from '../card/product'

import { getProducts } from '@/actions/product'
import { Carousel } from '@/components/carousel'
import { CATEGORY_CONSTANT } from '@/utils/const'
import { createSlug } from '@/utils/helper'

const ITEM_PER_PAGE = 8
const CategorySection = () => {
  const router = useRouter()

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'carousel'],
    queryFn: () => getProducts({ limit: ITEM_PER_PAGE }),
  })

  return (
    <div className='flex w-full flex-col gap-5 md:flex md:h-[500px] md:flex-row'>
      <Card className='h-[350px] md:h-[500px] md:w-[400px]'>
        <CardHeader>
          <span className='font-bold'>สินค้าตามหมวดหมู่</span>
        </CardHeader>
        <CardBody>
          <ScrollShadow className='p-1'>
            <div className='space-y-1'>
              {CATEGORY_CONSTANT.map((category) => (
                <CategoryCard key={category.id} item={category} />
              ))}
            </div>
          </ScrollShadow>
        </CardBody>
      </Card>

      <Card className='size-full'>
        <CardHeader>
          <div className='flex w-full items-center justify-between'>
            <span className='font-bold'>หมวดหมู่เสื้อผ้าแฟชั่น</span>

            <Button
              variant='light'
              onPress={() => {
                router.push(`/category/${createSlug('เสื้อผ้าแฟชั่น', '1')}`)
              }}
            >
              ดูทั้งหมด
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Carousel slidesToScroll className='items-center'>
            {isLoading &&
              [...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}

            {!isLoading &&
              products?.items?.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}

            <Button
              variant='faded'
              onPress={() => {
                router.push(`/category/${createSlug('เสื้อผ้าแฟชั่น', '1')}`)
              }}
            >
              ดูทั้งหมด
            </Button>
          </Carousel>
        </CardBody>
      </Card>
    </div>
  )
}

export { CategorySection }
