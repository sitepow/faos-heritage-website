import { Card, CardBody } from '@heroui/card'

import type { GetProductResult } from '@/app/(dashboard)/actions/product'
import type { FC } from 'react'

interface Props {
  product: GetProductResult
}

const DetailCard: FC<Props> = ({ product }) => {
  if (!product?.description) {
    return
  }

  return (
    <Card>
      <CardBody className='mx-auto max-w-4xl'>
        <article className='prose prose-neutral dark:prose-invert'>
          <div className='whitespace-pre-line text-default-600'>
            {product.description}
          </div>
        </article>
      </CardBody>
    </Card>
  )
}

export { DetailCard }
