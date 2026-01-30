/* eslint-disable @next/next/no-img-element */
'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import {
  Carousel,
  type CarouselHandle,
} from '@/components/ui/Carousel/Carousel'
import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils/style'

type ProductImagePreviewProps = {
  images?: string[]
  alt?: string
}

const ProductImagePreview = ({
  images = [],
  alt = 'product-image',
}: ProductImagePreviewProps) => {
  const mainCarouselRef = useRef<CarouselHandle>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const displayImages = useMemo(
    () => (images.length > 0 ? images : [IMAGE_FALLBACK.EMPTY]),
    [images],
  )

  const handleSelectImage = useCallback((index: number) => {
    setActiveIndex(index)
    mainCarouselRef.current?.scrollToSlide(index)
  }, [])

  return (
    <div className='flex flex-col gap-5'>
      <Carousel
        ref={mainCarouselRef}
        slidesToScroll
        autoPlay={false}
        onSlideChange={setActiveIndex}
      >
        {displayImages.map((image, index) => (
          <button
            key={image}
            aria-label={`View image ${index + 1}`}
            className='border-divider relative aspect-square size-full shrink-0 overflow-hidden rounded-lg border bg-white'
            type='button'
          >
            <img
              alt={`${alt}-${index}`}
              className='absolute inset-0 h-full w-full object-contain'
              src={image}
            />
          </button>
        ))}
      </Carousel>

      <Carousel slidesToScroll autoPlay={false}>
        {displayImages.map((image, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={`${image}-thumb`}
              aria-label={`Select image ${index + 1}`}
              className={cn(
                'relative aspect-square size-20 shrink-0 overflow-hidden rounded-lg border bg-white transition-colors sm:size-32',
                isActive ? 'border-primary' : 'border-divider',
              )}
              type='button'
              onClick={() => handleSelectImage(index)}
            >
              <img
                alt={`${alt}-thumbnail-${index}`}
                className='absolute inset-0 h-full w-full object-contain'
                src={image}
              />
            </button>
          )
        })}
      </Carousel>
    </div>
  )
}

export { ProductImagePreview }
