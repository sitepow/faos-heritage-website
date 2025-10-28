import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { ArrowRight } from 'lucide-react'

import { CategoryMenuItem } from './category-item'
import { Carousel } from '../carousel/carousel'
import { ProductCard } from '../product/product-card'

import { CATEGORY_CONSTANT, PRODUCT_CONSTANT } from '@/utils/const'

const CategorySection = () => {
  return (
    <div className='flex h-[500px] w-full gap-5'>
      <ScrollShadow className='w-[300px] p-1'>
        <div className='space-y-1'>
          {CATEGORY_CONSTANT.map((category) => (
            <CategoryMenuItem key={category.id} item={category} />
          ))}
        </div>
      </ScrollShadow>

      <Card fullWidth>
        <CardHeader>
          <div className='flex w-full items-center justify-between'>
            <span className='font-bold'>เสื้อผ้าแฟชั่น</span>

            <Button
              endContent={<ArrowRight className='text-divider' />}
              variant='light'
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

            <Button>ดูทั้งหมด</Button>
          </Carousel>
        </CardBody>
      </Card>
    </div>
  )
}

export { CategorySection }
