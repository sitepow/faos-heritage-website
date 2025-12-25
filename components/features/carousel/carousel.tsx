'use client'

import useEmblaCarousel from 'embla-carousel-react'

import type { ReactNode } from 'react'

import { CarouselNavigateButton } from './navigate-button'

import { useCarouselNavigation } from '@/hooks/useCarouselMethod'
import { cn } from '@/utils/style'

interface CarouselProps {
  className?: string
  children: ReactNode
  slidesToScroll?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export const Carousel = ({
  className,
  children,
  slidesToScroll,
  orientation = 'horizontal',
}: CarouselProps) => {
  const isVertical = orientation === 'vertical'

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: isVertical ? 'y' : 'x',
    dragFree: true,
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: slidesToScroll ? 'auto' : 1,
  })

  const { prevDisabled, nextDisabled, onPrev, onNext } =
    useCarouselNavigation(emblaApi)

  return (
    <div className='relative'>
      <div ref={emblaRef} className='overflow-hidden'>
        <div
          className={cn(
            isVertical ? 'flex flex-col gap-2' : 'flex gap-2',
            'px-1 md:gap-4',
            className,
          )}
        >
          {children}
        </div>
      </div>

      {!prevDisabled && (
        <CarouselNavigateButton
          className={cn(
            'absolute flex bg-black/20 hover:bg-black/30',
            isVertical
              ? 'top-4 left-1/2 -translate-x-1/2'
              : 'top-1/2 left-4 -translate-y-1/2',
          )}
          direction='prev'
          onClick={onPrev}
        />
      )}

      {!nextDisabled && (
        <CarouselNavigateButton
          className={cn(
            'absolute flex bg-black/20 hover:bg-black/30',
            isVertical
              ? 'bottom-4 left-1/2 -translate-x-1/2'
              : 'top-1/2 right-4 -translate-y-1/2',
          )}
          direction='next'
          onClick={onNext}
        />
      )}
    </div>
  )
}
