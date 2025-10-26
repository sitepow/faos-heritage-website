"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

import type { FC, ReactNode } from "react";
import { CarouselNavigateButton } from "./carousel-navigate-button";
import clsx from "clsx";

interface CarouselProps {
  className?: string;
  children: ReactNode;
  scrollByGroup?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
}

const Carousel: FC<CarouselProps> = ({
  className,
  children,
  scrollByGroup,
  loop = false,
  autoplay = false,
  autoplayDelay = 3000,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      dragFree: true,
      align: "start",
      containScroll: "trimSnaps",
      slidesToScroll: scrollByGroup ? "auto" : 1,
      loop: loop,
    },
    autoplay
      ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: true })]
      : []
  );

  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevDisabled(!emblaApi.canScrollPrev());
    setNextDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full max-w-full">
      <div ref={emblaRef} className="overflow-hidden">
        <div className={clsx("flex gap-2 px-1 md:gap-4", className)}>
          {children}
        </div>
      </div>

      {!prevDisabled && (
        <CarouselNavigateButton
          direction="prev"
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 bg-black/20 hover:bg-black/30 md:flex"
        />
      )}

      {!nextDisabled && (
        <CarouselNavigateButton
          direction="next"
          onClick={scrollNext}
          className="absolute right-4 top-1/2 hidden -translate-y-1/2 bg-black/20 hover:bg-black/30 md:flex"
        />
      )}
    </div>
  );
};

export { Carousel };
