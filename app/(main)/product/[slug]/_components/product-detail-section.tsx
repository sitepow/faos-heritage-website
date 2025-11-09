import { Card, CardBody } from '@heroui/card'

import { ProductDetailCard } from './card/product-detail-card'
import { ProductReviewCard } from './card/product-review-card'

const ProductDetailSection = () => {
  return (
    <div className='flex flex-col gap-4'>
      <span className='text-xl font-bold'>รายละเอียดสินค้า</span>
      <Card>
        <CardBody>
          <div className='grid grid-cols-3 gap-4'>
            <ProductDetailCard />
            <ProductReviewCard />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export { ProductDetailSection }
