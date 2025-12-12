import { type UseEmblaCarouselType } from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

type EmblaCarouselType = NonNullable<UseEmblaCarouselType['1']>

interface UseCarouselNavigation {
  prevDisabled: boolean
  nextDisabled: boolean
  onPrev: () => void
  onNext: () => void
}

const useCarouselNavigation = (
  emblaApi: EmblaCarouselType | undefined,
): UseCarouselNavigation => {
  const [prevDisabled, setPrevDisabled] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(true)

  const onPrev = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNext = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setPrevDisabled(!api.canScrollPrev())
    setNextDisabled(!api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevDisabled,
    nextDisabled,
    onPrev,
    onNext,
  }
}

export { useCarouselNavigation }
