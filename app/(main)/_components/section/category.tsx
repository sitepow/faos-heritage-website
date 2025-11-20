'use client'

import { Button, Card, CardBody, CardHeader, ScrollShadow } from '@heroui/react'
import { useRouter } from 'next/navigation'

import { CategoryCard } from '../card/category'
import { ProductCard } from '../card/product'

import { Carousel } from '@/components/carousel'
import { CATEGORY_CONSTANT, PRODUCT_CONSTANT } from '@/utils/const'
import { createSlug } from '@/utils/helper'

const CategorySection = () => {
  const router = useRouter()

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
            {PRODUCT_CONSTANT?.slice(0, 10).map((product) => (
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
