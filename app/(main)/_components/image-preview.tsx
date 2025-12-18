/* eslint-disable react/no-array-index-key */

'use client'

import Image from 'next/image'
import { useState, type ComponentPropsWithoutRef } from 'react'

import { Carousel } from '@/components/carousel'
import { cn } from '@/utils/style'

interface ImagePreviewProps extends ComponentPropsWithoutRef<'div'> {
  images: string[]
  alt?: string
}

const ImagePreview = ({
  images = [],
  alt = 'product-image',
  className,
  ...props
}: ImagePreviewProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const displayImages = images.length > 0 ? images : ['/no-image.png']
  const mainImage = displayImages[selectedIndex]

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-3 md:max-w-[325px] lg:max-w-[425px]',
        className,
      )}
      {...props}
    >
      <div className='relative aspect-square w-full overflow-hidden rounded-xl border border-divider'>
        <Image
          fill
          priority
          alt={alt}
          className='object-cover transition-opacity duration-300'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          src={mainImage}
        />
      </div>

      {displayImages.length > 1 && (
        <Carousel slidesToScroll className='gap-2'>
          {displayImages.map((image, index) => {
            const isActive = index === selectedIndex

            return (
              <button
                key={`${image}-${index}`}
                className={cn(
                  'relative aspect-square size-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                  isActive
                    ? 'border-primary ring-2 ring-primary/10'
                    : 'border-transparent hover:border-default-300',
                )}
                type='button'
                onClick={() => setSelectedIndex(index)}
              >
                <Image
                  fill
                  alt={`${alt}-thumb-${index}`}
                  className={cn(
                    'object-cover transition-opacity',
                    isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100',
                  )}
                  src={image}
                />
              </button>
            )
          })}
        </Carousel>
      )}
    </div>
  )
}

export { ImagePreview }
