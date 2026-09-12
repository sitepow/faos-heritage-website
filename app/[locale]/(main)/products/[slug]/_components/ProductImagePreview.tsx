/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'

import type { GetProductResult } from '@/features/product/types'
import type { TouchEvent } from 'react'

import { BadgeOverlay } from '@/components/ui/Product/BadgeOverlay'
import { IMAGE_FALLBACK } from '@/constants'
import { useProductPrice } from '@/features/product/hook'
import { cn } from '@/utils'

type Props = {
  product: GetProductResult | null
  images?: string[]
}

const ProductImagePreview = ({ product, images = [] }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const { maxDiscountPercentage } = useProductPrice(product)

  const displayImages = useMemo(
    () => (images.length > 0 ? images : [IMAGE_FALLBACK.EMPTY]),
    [images],
  )

  const safeIndex = activeIndex >= displayImages.length ? 0 : activeIndex
  const currentImage = displayImages[safeIndex] || IMAGE_FALLBACK.EMPTY

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }, [displayImages.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }, [displayImages.length])

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    touchStartX.current = null
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* Main Image Stage */}
      <div
        className='group relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-3 shadow-xs dark:border-white/10 dark:bg-neutral-900/60'
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <BadgeOverlay
          discount={maxDiscountPercentage}
          hasAnyDiscount={product?.hasAnyDiscount}
        />

        <img
          key={currentImage}
          alt={product?.name ?? 'Product preview'}
          className='size-full object-contain transition-transform duration-500 ease-out select-none group-hover:scale-105'
          src={currentImage}
        />

        {displayImages.length > 1 && (
          <>
            {/* Left Nav Arrow */}
            <button
              aria-label='Previous image'
              className='absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200/80 bg-white/90 text-neutral-700 shadow-md backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95 sm:opacity-0 sm:group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-900/90 dark:text-neutral-200 dark:hover:bg-neutral-800'
              type='button'
              onClick={handlePrev}
            >
              <ChevronLeft className='size-5' />
            </button>

            {/* Right Nav Arrow */}
            <button
              aria-label='Next image'
              className='absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200/80 bg-white/90 text-neutral-700 shadow-md backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95 sm:opacity-0 sm:group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-900/90 dark:text-neutral-200 dark:hover:bg-neutral-800'
              type='button'
              onClick={handleNext}
            >
              <ChevronRight className='size-5' />
            </button>

            {/* Counter Badge */}
            <div className='absolute right-3 bottom-3 rounded-full bg-neutral-900/60 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-md dark:bg-white/20'>
              {safeIndex + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className='scrollbar-none flex items-center gap-3 overflow-x-auto py-1'>
          {displayImages.map((image, index) => {
            const isActive = index === safeIndex

            return (
              <button
                key={`${image}-${index}`}
                aria-label={`Select product image ${index + 1}`}
                className={cn(
                  'relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 focus:outline-none sm:size-22',
                  isActive
                    ? 'scale-[1.03] border-amber-500 opacity-100 shadow-sm ring-2 ring-amber-500/40'
                    : 'border-neutral-200/80 opacity-60 hover:border-neutral-400 hover:opacity-100 dark:border-white/10 dark:hover:border-white/30',
                )}
                type='button'
                onClick={() => setActiveIndex(index)}
              >
                <img
                  alt={`${product?.name ?? 'Product'} thumbnail ${index + 1}`}
                  className='size-full bg-neutral-50 object-contain p-1.5 select-none dark:bg-neutral-900'
                  src={image}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export { ProductImagePreview }
