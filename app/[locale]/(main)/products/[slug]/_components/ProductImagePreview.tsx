/* eslint-disable @next/next/no-img-element */
'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import type { GetProductResult } from '@/features/product/types'

import {
  Carousel,
  type CarouselHandle,
} from '@/components/ui/Carousel/Carousel'
import { BadgeOverlay } from '@/components/ui/Product/BadgeOverlay'
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
        <BadgeOverlay
          discount={maxDiscountPercentage}
          hasAnyDiscount={product?.hasAnyDiscount}
        />

        <Carousel
          ref={mainCarouselRef}
          slidesToScroll
          autoPlay={false}
          onSlideChange={setActiveIndex}
        >
          {displayImages.map((image) => (
            <img
              key={image}
              className='border-default-100 aspect-square w-full rounded-xl border object-cover'
              src={image}
            />
          ))}
        </Carousel>
      </div>

      <Carousel slidesToScroll autoPlay={false}>
        {displayImages.map((image, index) => {
          const isActive = index === activeIndex

          return (
            <img
              key={image}
              className={cn(
                'size-20 cursor-pointer rounded-xl border-2 object-cover transition-all',
                isActive
                  ? 'border-primary'
                  : 'border-default-300 opacity-60 hover:opacity-100',
              )}
              src={image}
              onClick={() => handleSelectImage(index)}
            />
          )
        })}
      </Carousel>
    </div>
  )
}

export { ProductImagePreview }
