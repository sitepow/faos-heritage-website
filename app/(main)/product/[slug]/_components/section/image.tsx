import { Card, CardBody } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { CircleQuestionMarkIcon, FileIcon, TagIcon } from 'lucide-react'

import type { GetProductResult } from '@/app/(dashboard)/dashboard/product/actions/product'
import type { ComponentProps, FC } from 'react'

import { ProductImagePreview } from '@/app/(main)/_components/image-preview'
import { StarRating } from '@/app/(main)/_components/star-rating'
import { Share } from '@/components/share'
import { cn } from '@/utils/style'

type Props = ComponentProps<typeof Card> & {
  product?: GetProductResult
}

const ImageSection: FC<Props> = ({ className, product, ...props }) => {
  return (
    <Card className={cn(className)} {...props}>
      <CardBody>
        <div className='flex flex-col gap-5 md:flex-row'>
          <ProductImagePreview
            images={product?.images?.flatMap((image) => image?.url) ?? []}
          />

          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2 border-b border-divider pb-2'>
              <span className='text-xl font-bold'>{product?.name}</span>
              <StarRating rate={0} />

              <div className='flex flex-wrap gap-2'>
                {product?.isDemoProduct && (
                  <Chip
                    color='primary'
                    startContent={
                      <CircleQuestionMarkIcon className='size-4 text-primary' />
                    }
                    variant='bordered'
                  >
                    Product samples
                  </Chip>
                )}

                {product?.isDigitalProduct && (
                  <Chip
                    color='primary'
                    startContent={<FileIcon className='size-4 text-primary' />}
                    variant='bordered'
                  >
                    Digital products
                  </Chip>
                )}
                <Chip
                  color='primary'
                  startContent={<TagIcon className='size-4 text-primary' />}
                  variant='bordered'
                >
                  {product?.category?.name ?? 'No category'}
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
