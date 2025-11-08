'use client'

import clsx from 'clsx'
import useEmblaCarousel from 'embla-carousel-react'

import type { FC, ReactNode } from 'react'

import CarouselNavigateButton from './carousel-navigate-button'

import { useCarouselNavigation } from '@/hooks/useCarouselMethod'

interface CarouselProps {
  className?: string
  children: ReactNode
  slidesToScroll?: boolean
}

const Carousel: FC<CarouselProps> = ({
  className,
  children,
  slidesToScroll,
}) => {
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
        <div className={clsx('flex gap-2 px-1', className)}>{children}</div>
      </div>

      {!prevDisabled && (
        <CarouselNavigateButton
          className='absolute top-1/2 left-4 hidden -translate-y-1/2 bg-black/20 hover:bg-black/30 md:flex'
          direction='prev'
          onClick={onPrev}
        />
      )}

      {!nextDisabled && (
        <CarouselNavigateButton
          className='absolute top-1/2 right-4 hidden -translate-y-1/2 bg-black/20 hover:bg-black/30 md:flex'
          direction='next'
          onClick={onNext}
        />
      )}
    </div>
  )
}

export { Carousel }
