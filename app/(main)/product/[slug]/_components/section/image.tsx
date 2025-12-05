import { Card, CardBody } from '@heroui/card'

import type { ComponentProps, FC } from 'react'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/actions/product'
import { ProductImagePreview } from '@/app/(main)/_components/image-preview'
import { StarRating } from '@/app/(main)/_components/star-rating'
import { Share } from '@/components/share'
import { cn } from '@/utils/style'
import { Chip } from '@heroui/chip'
import { FileIcon, TagIcon } from 'lucide-react'

type Props = ComponentProps<typeof Card> & {
  product?: GetProductResult
}

const ImageSection: FC<Props> = ({ className, product, ...props }) => {
  return (
    <Card className={cn(className)} {...props}>
      <CardBody>
        <div className='flex flex-col gap-5 md:flex-row'>
          <ProductImagePreview images={product?.images?.flatMap((image) => image?.url) ?? []} />

          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2 border-b border-divider pb-2'>
              <span className='text-xl font-bold'>{product?.name}</span>
              <StarRating rate={5} />

              <div className='flex flex-wrap gap-2'>
                <Chip
                  variant='faded'
                  startContent={<FileIcon className='size-4 text-default-500' />}
                >
                  สินค้าดิจิทัล
                </Chip>
                <Chip
                  variant='faded'
                  startContent={<TagIcon className='size-4 text-default-500' />}
                >
                  {product?.category?.name ?? 'ไม่มีหมวดหมู่'}
                </Chip>
              </div>
            </div>

            <span>{product?.shortDescription}</span>
            <Share />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { ImageSection }
