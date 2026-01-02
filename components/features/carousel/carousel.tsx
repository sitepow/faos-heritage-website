'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useEffect, useRef } from 'react'

import type { ReactNode } from 'react'

import { CarouselNavigateButton } from './navigate-button'

import { useCarouselNavigation } from '@/hooks/useCarouselMethod'
import { cn } from '@/utils/style'

interface CarouselProps {
  wrapperClassName?: string
  trackClassName?: string
  children: ReactNode
  slidesToScroll?: boolean
  isVertical?: boolean
  autoPlay?: boolean
  loop?: boolean
}

export const Carousel = ({
  wrapperClassName,
  trackClassName,
  children,
  slidesToScroll,
  isVertical,
  loop = false,
  autoPlay = true,
}: CarouselProps) => {
  const autoplayRef = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      axis: isVertical ? 'y' : 'x',
      dragFree: true,
      align: 'start',
      slidesToScroll: slidesToScroll ? 'auto' : 1,
      loop: loop,
    },
    autoPlay ? [autoplayRef.current] : [],
  )

  const { prevDisabled, nextDisabled, onPrev, onNext } =
    useCarouselNavigation(emblaApi)

  useEffect(() => {
    if (!emblaApi || !autoPlay) return
    autoplayRef.current.reset()
  }, [emblaApi, autoPlay])

  return (
    <div className={cn('relative', wrapperClassName)}>
      <div ref={emblaRef} className='overflow-hidden'>
        <div
          className={cn(
            isVertical ? 'flex flex-col gap-2' : 'flex gap-2',
            trackClassName,
          )}
        >
          {children}
        </div>
      </div>

      {!prevDisabled && (
        <CarouselNavigateButton
          isVertical={isVertical}
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
          isVertical={isVertical}
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
