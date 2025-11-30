import { Card, CardBody } from '@heroui/card'

import type { ComponentProps, FC } from 'react'

import { useProductStore } from '../../store'

import { ProductImagePreview } from '@/app/(main)/_components/image-preview'
import { StarRating } from '@/app/(main)/_components/star-rating'
import { Share } from '@/components/share'
import { cn } from '@/utils/style'

const ImageSection: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  const { product } = useProductStore()

  return (
    <Card className={cn(className)} {...props}>
      <CardBody>
        <div className='flex flex-col gap-5 md:flex-row'>
          <ProductImagePreview images={product?.images?.flatMap((image) => image?.url) ?? []} />

          <div className='flex flex-col gap-4'>
            <div className='flex flex-col border-b border-divider pb-2'>
              <span className='text-xl font-bold'>{product?.name}</span>
              <StarRating rate={5} />
            </div>

            <div className='flex flex-col'>
              <span>{product?.shortDescription}</span>
              <span className='text-default-500'>รหัสสินค้า: {product?.id}</span>
            </div>
            <Share />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { ImageSection }
