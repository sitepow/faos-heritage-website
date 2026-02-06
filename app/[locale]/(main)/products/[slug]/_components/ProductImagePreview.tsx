'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import {
  Carousel,
  type CarouselHandle,
} from '@/components/ui/Carousel/Carousel'
import { ProductImage } from '@/components/ui/Product/ProductImage'
import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils'

type ProductImagePreviewProps = {
  images?: string[]
}

const ProductImagePreview = ({ images = [] }: ProductImagePreviewProps) => {
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
        {displayImages.map((image) => (
          <ProductImage key={image} image={image} />
        ))}
      </Carousel>

      <Carousel slidesToScroll autoPlay={false}>
        {displayImages.map((image, index) => {
          const isActive = index === activeIndex

          return (
            <ProductImage
              key={image}
              className={cn(
                'size-20 cursor-pointer',
                isActive ? 'border-primary' : 'border-default-100',
              )}
              image={image}
              onClick={() => handleSelectImage(index)}
            />
          )
        })}
      </Carousel>
    </div>
  )
}

export { ProductImagePreview }
