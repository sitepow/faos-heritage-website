import { Card, CardBody, CardHeader } from '@heroui/card'

import type { GetProductResult } from '@/app/(dashboard)/actions/product'
import type { FC } from 'react'

import { SubHeading } from '@/components/heading'

interface Props {
  product: GetProductResult
}

const DetailCard: FC<Props> = ({ product }) => {
  return (
    <Card className='col-span-2' shadow='none'>
      <CardHeader className='flex-col items-start gap-4'>
        <SubHeading title='Details' />
      </CardHeader>
      <CardBody>
        <p className='whitespace-pre-line'>{product?.description}</p>
      </CardBody>
    </Card>
  )
}

export { DetailCard }
