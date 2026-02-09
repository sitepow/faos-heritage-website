/* eslint-disable react-hooks/exhaustive-deps */
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
  children: ReactNode
  wrapperClassName?: string
  trackClassName?: string
  slidesToScroll?: boolean
  autoPlay?: boolean
  loop?: boolean
  onSlideChange?: (index: number) => void
}

type CarouselHandle = {
  scrollToSlide: (index: number) => void
}

const Carousel = forwardRef<CarouselHandle, CarouselProps>(
  (
    {
      children,
      wrapperClassName,
      trackClassName,
      slidesToScroll = false,
      autoPlay = true,
      loop = false,
      onSlideChange,
    },
    ref,
  ) => {
    const autoplayRef = useRef(
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
      () => (autoPlay ? [autoplayRef.current] : []),
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

    const { prevDisabled, nextDisabled, scrollPrev, scrollNext } =
      useCarouselNavigation(emblaApi)

    useEffect(() => {
      if (!emblaApi || !onSlideChange) {
        return
      }

      const handler = () => {
        onSlideChange(emblaApi.selectedScrollSnap())
      }

      emblaApi.on('select', handler)
      emblaApi.on('reInit', handler)

      return () => {
        emblaApi.off('select', handler)
        emblaApi.off('reInit', handler)
      }
    }, [emblaApi, onSlideChange])

    useEffect(() => {
      if (!emblaApi || !autoPlay) {
        return
      }

      autoplayRef.current.play()
      return () => autoplayRef.current.stop()
    }, [emblaApi, autoPlay])

    return (
      <div className={cn('relative', wrapperClassName)}>
        <div ref={emblaRef} className='overflow-hidden'>
          <div className={cn('flex gap-2', trackClassName)}>{children}</div>
        </div>

        {!prevDisabled && (
          <CarouselNavigateButton
            className='-t-y-1/2 absolute top-1/2 left-4'
            direction='prev'
            onClick={scrollPrev}
          />
        )}

        {!nextDisabled && (
          <CarouselNavigateButton
            className='-t-y-1/2 absolute top-1/2 right-4'
            direction='next'
            onClick={scrollNext}
          />
        )}
      </div>
    )
  },
)

export { Carousel }
export type { CarouselHandle }
