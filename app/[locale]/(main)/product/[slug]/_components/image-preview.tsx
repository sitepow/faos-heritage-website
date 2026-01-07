/* eslint-disable react/no-array-index-key */

'use client'

import { Card, CardBody } from '@heroui/react'
import Image from 'next/image'
import { useState, type ComponentPropsWithoutRef } from 'react'

import { Carousel } from '@/components/features/carousel/carousel'
import { NO_IMAGE } from '@/utils/constants'
import { cn } from '@/utils/style'

type ProductImagePreviewProps = ComponentPropsWithoutRef<'div'> & {
  images: string[]
  alt?: string
}

export const ProductImagePreview = ({
  images = [],
  alt = 'product-image',
  className,
  ...props
}: ProductImagePreviewProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const displayImages = images.length > 0 ? images : [NO_IMAGE]
  const mainImage = displayImages[selectedIndex]

  return (
    <Card>
      <CardBody>
        <div
          className={cn(
            'flex h-[650px] w-full flex-col gap-3 overflow-hidden',
            className,
          )}
          {...props}
        >
          <div className='relative aspect-square size-full overflow-hidden'>
            <Image
              fill
              priority
              alt={alt}
              className='aspect-square object-contain transition-opacity duration-300'
              src={mainImage}
            />
          </div>

          {displayImages.length > 1 && (
            <Carousel slidesToScroll autoPlay={false}>
              {displayImages.map((image, index) => {
                const isActive = index === selectedIndex

                return (
                  <button
                    key={`${image}-${index}`}
                    className={cn(
                      'order relative aspect-square size-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                      isActive
                        ? 'border-primary ring-primary/10 ring-2'
                        : 'hover:border-default-300 border-divider',
                    )}
                    type='button'
                    onClick={() => setSelectedIndex(index)}
                  >
                    <Image
                      fill
                      alt={`${alt}-thumb-${index}`}
                      className={cn(
                        'object-contain transition-opacity',
                        isActive
                          ? 'opacity-100'
                          : 'opacity-60 hover:opacity-100',
                      )}
                      src={image}
                    />
                  </button>
                )
              })}
            </Carousel>
          )}
        </div>
      </CardBody>
    </Card>
  )
}
