import { useCallback, useEffect, useState } from 'react'

import type { EmblaCarouselType } from 'embla-carousel'

interface CarouselNavigationParams {
  prevDisabled: boolean
  nextDisabled: boolean
  scrollPrev: () => void
  scrollNext: () => void
}

const useCarouselNavigation = (
  emblaApi?: EmblaCarouselType,
): CarouselNavigationParams => {
  const [prevDisabled, setPrevDisabled] = useState(false)
  const [nextDisabled, setNextDisabled] = useState(false)

  const updateNavigation = useCallback(() => {
    if (!emblaApi) return

    setPrevDisabled(!emblaApi.canScrollPrev())
    setNextDisabled(!emblaApi.canScrollNext())
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    updateNavigation()

    emblaApi.on('select', updateNavigation)
    emblaApi.on('reInit', updateNavigation)

    return () => {
      emblaApi.off('select', updateNavigation)
      emblaApi.off('reInit', updateNavigation)
    }
  }, [emblaApi, updateNavigation])

  return {
    prevDisabled,
    nextDisabled,
    scrollPrev,
    scrollNext,
  }
}

export { useCarouselNavigation }
