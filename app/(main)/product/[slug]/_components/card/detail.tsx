import { Card, CardBody, CardHeader } from '@heroui/card'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/actions/product'
import { SubHeader } from '@/app/(main)/_components/section/header'
import type { FC } from 'react'

interface Props {
  product: GetProductResult
}

const DetailCard: FC<Props> = ({ product }) => {
  return (
    <Card className='col-span-2' shadow='none'>
      <CardHeader className='flex-col items-start gap-4'>
        <SubHeader title='รายละเอียด' />
      </CardHeader>
      <CardBody>
        <p className='whitespace-pre-line'>{product?.description}</p>
      </CardBody>
    </Card>
  )
}

export { DetailCard }
