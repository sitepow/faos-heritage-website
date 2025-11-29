import { Card, CardBody } from '@heroui/card'

import { useProductStore } from '../../store'
import { DetailCard } from '../card/detail'
import { ReviewCard } from '../card/review'

const DetailSection = () => {
  const { product } = useProductStore()

  if (!product?.description) return null

  return (
    <div className='flex flex-col gap-4'>
      <span className='mx-auto w-fit border-b border-primary-website pb-1 text-xl font-bold'>
        รายละเอียดสินค้า
      </span>
      <Card>
        <CardBody>
          <div className='grid gap-4 lg:grid-cols-4'>
            <DetailCard />
            <ReviewCard />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export { DetailSection }
