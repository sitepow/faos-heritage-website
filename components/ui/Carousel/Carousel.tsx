/* eslint-disable no-unused-vars */
'use client'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'

import type { EmblaOptionsType } from 'embla-carousel'
import type { ReactNode } from 'react'

import { CarouselNavigateButton } from './CarouselNavigateButton'

import { useCarouselNavigation } from '@/hooks/useCarouselNavigation'
import { cn } from '@/utils/style'

interface CarouselProps {
  wrapperClassName?: string
  trackClassName?: string
  children: ReactNode
  slidesToScroll?: boolean
  autoPlay?: boolean
  loop?: boolean
}

export type CarouselHandle = {
  scrollToSlide: (index: number) => void
}

const Carousel = forwardRef<CarouselHandle, CarouselProps>(
  (
    {
      wrapperClassName,
      trackClassName,
      children,
      slidesToScroll = false,
      loop = false,
      autoPlay = true,
    },
    ref,
  ) => {
    const autoplay = useRef(
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    )

    const options = useMemo<EmblaOptionsType>(
      () => ({
        axis: 'x',
        align: 'start',
        dragFree: true,
        slidesToScroll: slidesToScroll ? 'auto' : 1,
        loop,
      }),
      [slidesToScroll, loop],
    )

    const plugins = useMemo(
      () => (autoPlay ? [autoplay.current] : []),
      [autoPlay],
    )

    const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)

    const scrollToSlide = useCallback(
      (index: number) => {
        emblaApi?.scrollTo(index)
      },
      [emblaApi],
    )

    useImperativeHandle(ref, () => ({ scrollToSlide }), [scrollToSlide])

    const { prevDisabled, nextDisabled, onPrev, onNext } =
      useCarouselNavigation(emblaApi)

    useEffect(() => {
      if (!emblaApi) {
        return
      }

      autoPlay ? autoplay.current.play() : autoplay.current.stop()
    }, [emblaApi, autoPlay])

    return (
      <div className={cn('relative', wrapperClassName)}>
        <div ref={emblaRef} className='overflow-hidden'>
          <div className={cn('flex gap-2', trackClassName)}>{children}</div>
        </div>

        {!prevDisabled && (
          <CarouselNavigateButton
            className='absolute top-1/2 left-4 -translate-y-1/2 bg-black/20 hover:bg-black/30'
            direction='prev'
            onClick={onPrev}
          />
        )}

        {!nextDisabled && (
          <CarouselNavigateButton
            className='absolute top-1/2 right-4 -translate-y-1/2 bg-black/20 hover:bg-black/30'
            direction='next'
            onClick={onNext}
          />
        )}
      </div>
    )
  },
)

export { Carousel }
