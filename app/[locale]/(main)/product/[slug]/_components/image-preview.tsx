/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
'use client'

import { useRef, useState } from 'react'

import { Carousel, type CarouselHandle } from '@/components/carousel/carousel'
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
  const mainCarouselRef = useRef<CarouselHandle>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <div className='flex flex-col gap-5'>
      <Carousel ref={mainCarouselRef} slidesToScroll autoPlay={false}>
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
                  alt={`${alt}-${index}`}
                  className='absolute inset-0 h-full w-full object-contain transition-opacity'
                />
              </div>
            </button>
          )
        })}
      </Carousel>

      <Carousel slidesToScroll autoPlay={false}>
        {displayImages.map((image, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={`${image}-${index}`}
              type='button'
              onClick={() => {
                setActiveIndex(index)
                mainCarouselRef.current?.scrollToSlide(index)
              }}
              className={cn(
                'relative aspect-square size-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border bg-white transition-all sm:size-32',
                isActive ? 'border-primary' : 'border-divider',
              )}
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
    </div>
  )
}
