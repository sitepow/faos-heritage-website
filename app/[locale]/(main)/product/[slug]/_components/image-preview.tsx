/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
'use client'

import { Carousel } from '@/components/carousel/carousel'
import { NO_IMAGE } from '@/utils/constants/seo'
import { cn } from '@/utils/style'

type Props = {
  images: string[]
  alt?: string
}

export const ProductImagePreview = ({
  images = [],
  alt = 'product-image',
}: Props) => {
  const displayImages = images.length > 0 ? images : [NO_IMAGE]

  return (
    <Carousel slidesToScroll autoPlay={false}>
      {displayImages.map((image, index) => {
        return (
          <button
            key={`${image}-${index}`}
            className={cn(
              'border-divider relative aspect-square size-full shrink-0 overflow-hidden rounded-lg border bg-white transition-all',
            )}
            type='button'
          >
            <div className='relative size-full'>
              <img
                src={image}
                alt={`${alt}-thumb-${index}`}
                className='absolute inset-0 h-full w-full object-contain transition-opacity'
              />
            </div>
          </button>
        )
      })}
    </Carousel>
  )
}
