'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import type { GetProductResult } from '@/features/product/types'

import {
  Carousel,
  type CarouselHandle,
} from '@/components/ui/Carousel/Carousel'
import { DiscountBadge } from '@/components/ui/Product/DiscountBadge'
import { ProductImage } from '@/components/ui/Product/ProductImage'
import { IMAGE_FALLBACK } from '@/constants'
import { useProductPrice } from '@/features/product/hook'
import { cn } from '@/utils'

type Props = {
  product: GetProductResult | null
  images?: string[]
}

const ProductImagePreview = ({ product, images = [] }: Props) => {
  const mainCarouselRef = useRef<CarouselHandle>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { maxDiscountPercentage } = useProductPrice(product)

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
      <div className='relative'>
        <DiscountBadge percentage={maxDiscountPercentage} />

        <Carousel
          ref={mainCarouselRef}
          slidesToScroll
          autoPlay={false}
          onSlideChange={setActiveIndex}
        >
          {displayImages.map((image) => (
            <ProductImage
              key={image}
              className='aspect-square w-full object-cover'
              image={image}
            />
          ))}
        </Carousel>
      </div>

      <Carousel slidesToScroll autoPlay={false}>
        {displayImages.map((image, index) => {
          const isActive = index === activeIndex

          return (
            <ProductImage
              key={image}
              className={cn(
                'size-20 cursor-pointer border-2 transition-all',
                isActive
                  ? 'border-primary'
                  : 'border-default-300 opacity-60 hover:opacity-100',
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
