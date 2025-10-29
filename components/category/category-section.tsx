/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client'

import { Button, Card, CardBody, CardHeader, ScrollShadow } from '@heroui/react'
import { useRouter } from 'next/navigation'

import { CategoryItem } from './category-item'
import { Carousel } from '../carousel/carousel'
import { ProductCard } from '../product/product-card'

import { CATEGORY_CONSTANT, PRODUCT_CONSTANT } from '@/utils/const'
import { createSlug } from '@/utils/slug'

const CategorySection = () => {
  const router = useRouter()

  return (
    <div className='flex h-[500px] w-full gap-5'>
      <Card className='w-[400px]'>
        <CardHeader>
          <span className='font-bold'>สินค้าของเรา</span>
        </CardHeader>
        <CardBody>
          <ScrollShadow className='p-1'>
            <div className='space-y-1'>
              {CATEGORY_CONSTANT.map((category) => (
                <CategoryItem key={category.id} item={category} />
              ))}
            </div>
          </ScrollShadow>
        </CardBody>
      </Card>

      <Card fullWidth>
        <CardHeader>
          <div className='flex w-full items-center justify-between'>
            <span className='font-bold'>เสื้อผ้าแฟชั่น</span>

            <span
              className='cursor-pointer hover:underline'
              onClick={() => {
                router.push(`/category/${createSlug('เสื้อผ้าแฟชั่น', '1')}`)
              }}
            >
              ดูทั้งหมด
            </span>
          </div>
        </CardHeader>
        <CardBody>
          <Carousel slidesToScroll className='items-center'>
            {PRODUCT_CONSTANT?.slice(0, 10).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}

            <Button
              onClick={() => {
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
