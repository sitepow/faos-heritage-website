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
}

export const Carousel = ({
  className,
  children,
  slidesToScroll,
}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: slidesToScroll ? 'auto' : 1,
  })

  const { prevDisabled, nextDisabled, onPrev, onNext } =
    useCarouselNavigation(emblaApi)

  return (
    <div className='relative w-full max-w-full'>
      <div ref={emblaRef} className='overflow-hidden'>
        <div className={cn('flex gap-2 px-1 md:gap-4', className)}>
          {children}
        </div>
      </div>

      {!prevDisabled && (
        <CarouselNavigateButton
          className='absolute top-1/2 left-4 flex -translate-y-1/2 bg-black/20 hover:bg-black/30'
          direction='prev'
          onClick={onPrev}
        />
      )}

      {!nextDisabled && (
        <CarouselNavigateButton
          className='absolute top-1/2 right-4 flex -translate-y-1/2 bg-black/20 hover:bg-black/30'
          direction='next'
          onClick={onNext}
        />
      )}
    </div>
  )
}
