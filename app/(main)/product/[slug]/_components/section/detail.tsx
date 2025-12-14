import { Card, CardBody } from '@heroui/card'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/actions/product'
import type { FC } from 'react'

import { DetailCard } from '../card/detail'
import { ReviewCard } from '../card/review'

interface Props {
  product?: GetProductResult
}

const DetailSection: FC<Props> = ({ product }) => {
  if (!product?.description) return null

  return (
    <div className='flex flex-col gap-4'>
      <span className='mx-auto w-fit border-b border-primary-website pb-1 text-xl font-bold'>
        Product details
      </span>
      <Card>
        <CardBody>
          <div className='grid gap-4 lg:grid-cols-4'>
            <DetailCard product={product} />
            <ReviewCard />
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export { DetailSection }
