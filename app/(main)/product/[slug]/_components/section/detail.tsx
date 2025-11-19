import { Card, CardBody } from '@heroui/card'

import { DetailCard } from '../card/detail'
import { ReviewCard } from '../card/review'

const DetailSection = () => {
  return (
    <div className='flex flex-col gap-4'>
      <span className='text-xl font-bold'>รายละเอียดสินค้า</span>
      <Card>
        <CardBody>
          <div className='grid grid-cols-3 gap-4'>
            <DetailCard />
            <ReviewCard />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export { DetailSection }
