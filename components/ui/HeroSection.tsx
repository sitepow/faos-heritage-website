/* eslint-disable @next/next/no-img-element */
'use client'

import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { BadgeOverlay } from './Product/BadgeOverlay'

import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern'
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text'
import { BorderBeam } from '@/components/magicui/border-beam'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { Button } from '@/components/ui/button'
import { PAGINATION } from '@/constants'
import { useProductPrice, useProducts } from '@/features/product/hook'
import { gsap } from '@/hooks/useGsap'

const HeroSection = () => {
  const locale = useLocale()
  const t = useTranslations('landing.hero')
  const [currentIndex, setCurrentIndex] = useState(0)
  const heroCardRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useProducts({
    itemsPerPage: PAGINATION.ITEMS_PER_PAGE,
    locale,
  })

  const products = data?.items ?? []
  const currentProduct = products[currentIndex]

  const { displayPrice, maxDiscountPercentage } =
    useProductPrice(currentProduct)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      return prev === products.length - 1 ? 0 : prev + 1
    })
  }, [products.length])

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      return prev === 0 ? products.length - 1 : prev - 1
    })
  }

  // GSAP animation when product changes
  useEffect(() => {
    if (!currentProduct || !heroCardRef.current) return

    gsap.fromTo(
      heroCardRef.current,
      { opacity: 0.7, scale: 0.98 },
      { duration: 0.45, ease: 'power2.out', opacity: 1, scale: 1 },
    )
  }, [currentIndex, currentProduct])

  // Auto-play slider every 8 seconds
  useEffect(() => {
    if (products.length <= 1) return

    const timer = setInterval(nextSlide, 8000)
    return () => clearInterval(timer)
  }, [nextSlide, products.length])

  const primaryImage = useMemo(() => {
    return currentProduct?.images?.find((img) => img.isPrimary === true)
  }, [currentProduct])

  if (isLoading || products.length === 0) {
    return (
      <div className='flex h-[550px] w-full animate-pulse items-center justify-center rounded-3xl bg-neutral-100 md:h-[650px] dark:bg-neutral-900' />
    )
  }

  return (
    <section
      className='relative w-full overflow-hidden pt-8 pb-14 sm:pt-12 sm:pb-18 md:pt-16 md:pb-24'
      id='hero'
    >
      {/* Ambient background glows */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-full max-w-4xl -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent blur-[120px] dark:from-amber-500/15'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-48 -left-32 -z-10 size-80 rounded-full bg-emerald-500/10 blur-[100px]'
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute top-60 -right-32 -z-10 size-80 rounded-full bg-amber-500/10 blur-[100px]'
      />

      {/* Magic UI Animated Grid Pattern */}
      <AnimatedGridPattern
        className='pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_80%)] opacity-30 dark:opacity-20'
        duration={3}
        height={44}
        maxOpacity={0.2}
        numSquares={24}
        width={44}
      />

      <div className='relative mx-auto flex w-full max-w-6xl flex-col items-center justify-start px-4 text-center sm:px-6 md:px-8'>
        {/* Top Shiny Pill Badge (sitepow.store style) */}
        <div className='mb-4'>
          <Link
            className='group inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-amber-500/30 bg-white/80 px-3.5 py-1.5 text-xs font-semibold shadow-xs backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/50 sm:px-4.5 sm:py-2 dark:border-amber-400/25 dark:bg-neutral-900/80'
            href='#heritage'
          >
            <span className='relative flex size-2'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-amber-500 opacity-75' />
              <span className='relative inline-flex size-2 rounded-full bg-amber-500' />
            </span>
            <span className='shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300'>
              {t('badgeTag')}
            </span>
            <AnimatedShinyText className='text-[11px] font-semibold text-neutral-800 sm:text-xs dark:text-neutral-200'>
              {t('badgeText')}
            </AnimatedShinyText>
            <ArrowRight className='size-3.5 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-amber-600 dark:text-neutral-500 dark:group-hover:text-amber-400' />
          </Link>
        </div>

        {/* High-Impact Headline */}
        <h1 className='text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl dark:text-white'>
          <span>{t('headlinePrefix')}</span>
          <br className='hidden sm:inline' />
          <span className='bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-amber-500'>
            {t('headlineHighlight')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className='mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base md:text-lg dark:text-neutral-300'>
          {t('subtitle')}
        </p>

        {/* Dual CTAs (sitepow.store style) */}
        <div className='mt-7 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4'>
          <Link className='w-full sm:w-auto' href='#products'>
            <ShimmerButton
              background='linear-gradient(135deg, #ba8c25 0%, #946914 100%)'
              className='h-12 w-full px-7 shadow-lg shadow-amber-500/20 sm:w-auto'
              shimmerColor='#ffe399'
              shimmerDuration='2.2s'
            >
              <span className='flex items-center justify-center gap-2 text-sm font-bold text-white'>
                <ShoppingBag className='size-4' />
                <span>{t('ctaShop')}</span>
                <ArrowRight className='size-4' />
              </span>
            </ShimmerButton>
          </Link>

          <Link className='w-full sm:w-auto' href='#heritage'>
            <Button
              className='h-12 w-full rounded-full border-neutral-300/80 bg-white/70 px-7 text-sm font-semibold text-neutral-800 shadow-xs backdrop-blur-md transition-all hover:border-amber-500 hover:bg-neutral-50 sm:w-auto dark:border-white/15 dark:bg-neutral-900/70 dark:text-neutral-100 dark:hover:border-amber-400 dark:hover:bg-neutral-800'
              variant='outline'
            >
              <span>{t('ctaStory')}</span>
            </Button>
          </Link>
        </div>

        {/* Trust Proof Bar (sitepow.store style) */}
        <div className='mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:gap-6 sm:text-sm'>
          {/* Rating & Avatars */}
          <div className='flex items-center gap-2.5'>
            <div className='flex -space-x-2'>
              <span className='inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-[10px] font-bold text-white shadow-xs ring-2 ring-white sm:size-7 dark:ring-neutral-900'>
                GR
              </span>
              <span className='inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-[10px] font-bold text-white shadow-xs ring-2 ring-white sm:size-7 dark:ring-neutral-900'>
                EV
              </span>
              <span className='inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 text-[10px] font-bold text-white shadow-xs ring-2 ring-white sm:size-7 dark:ring-neutral-900'>
                SP
              </span>
              <span className='inline-flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-[10px] font-bold text-white shadow-xs ring-2 ring-white sm:size-7 dark:ring-neutral-900'>
                CR
              </span>
            </div>
            <div className='flex flex-col text-left'>
              <div className='flex items-center gap-0.5 text-amber-500'>
                {[1, 2, 3, 4, 5].map((starId) => (
                  <Star
                    key={starId}
                    className='size-3 fill-amber-500 text-amber-500'
                  />
                ))}
              </div>
              <span className='text-[10px] font-medium text-neutral-500 sm:text-[11px] dark:text-neutral-400'>
                {t('reviewsProof')}
              </span>
            </div>
          </div>

          <div className='hidden h-3.5 w-px bg-neutral-300 sm:block dark:bg-neutral-700' />

          {/* 3 Checks */}
          <div className='flex flex-wrap items-center justify-center gap-3 text-[11px] font-medium sm:gap-4 sm:text-xs'>
            <span className='flex items-center gap-1 font-semibold text-neutral-800 dark:text-neutral-200'>
              <Check className='size-3.5 text-emerald-600 dark:text-emerald-400' />
              {t('checks.coldPressed')}
            </span>
            <span className='flex items-center gap-1 font-semibold text-neutral-800 dark:text-neutral-200'>
              <Check className='size-3.5 text-emerald-600 dark:text-emerald-400' />
              {t('checks.organic')}
            </span>
            <span className='flex items-center gap-1 font-semibold text-neutral-800 dark:text-neutral-200'>
              <Check className='size-3.5 text-emerald-600 dark:text-emerald-400' />
              {t('checks.express')}
            </span>
          </div>
        </div>

        {/* Featured Showcase Card (Perspective distant style with BorderBeam) */}
        <div className='relative mx-auto mt-10 w-full max-w-4xl sm:mt-14'>
          {/* Ambient Glow behind the card */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 opacity-70 blur-3xl sm:-inset-6 dark:opacity-40'
          />

          <div
            ref={heroCardRef}
            className='relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white/80 p-5 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-7 dark:border-white/10 dark:bg-neutral-900/80'
          >
            {/* Magic UI Border Beam */}
            <BorderBeam
              anchor={90}
              borderWidth={2}
              colorFrom='#ba8c25'
              colorTo='#f59e0b'
              duration={10}
              size={320}
            />

            <div className='grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8'>
              {/* Product Image Stage */}
              <div className='group relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-2 dark:border-white/10 dark:bg-neutral-950/60'>
                {primaryImage?.url && (
                  <img
                    alt={currentProduct?.name ?? t('greekProductAlt')}
                    className='size-full rounded-lg object-contain transition-transform duration-700 ease-out group-hover:scale-105'
                    src={primaryImage.url}
                  />
                )}
                <BadgeOverlay
                  discount={maxDiscountPercentage}
                  hasAnyDiscount={currentProduct?.hasAnyDiscount}
                />
              </div>

              {/* Product Info & Controls */}
              <div className='flex flex-col items-center text-center md:items-start md:text-left'>
                <div className='inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300'>
                  <Sparkles className='size-3.5' />
                  <span>
                    {t('featuredProduct', { number: currentIndex + 1 })}
                  </span>
                </div>

                <h3 className='mt-2.5 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl dark:text-white'>
                  {currentProduct?.name}
                </h3>

                <p className='mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-300'>
                  {currentProduct?.summary || t('defaultSummary')}
                </p>

                {/* Highlights */}
                <div className='mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start'>
                  <span className='inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
                    <Leaf className='size-3 text-emerald-600 dark:text-emerald-400' />
                    Cold-Pressed &lt;27°C
                  </span>
                  <span className='inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
                    <ShieldCheck className='size-3 text-amber-600 dark:text-amber-400' />
                    EU Organic Certified
                  </span>
                  <span className='inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
                    <Droplets className='size-3 text-sky-500' />
                    Acidity &lt; 0.3%
                  </span>
                </div>

                {/* Price & Action */}
                <div className='mt-5 flex w-full items-center justify-between border-t border-neutral-200/60 pt-4 dark:border-white/10'>
                  <div className='flex flex-col text-left'>
                    <span className='text-[10px] text-neutral-400'>
                      {t('startingPrice')}
                    </span>
                    <span className='text-lg font-extrabold text-neutral-900 sm:text-xl dark:text-white'>
                      {displayPrice}
                    </span>
                  </div>

                  <Link href={`/products/${currentProduct?.slug}`}>
                    <Button
                      className='h-9 rounded-full bg-amber-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600'
                      size='sm'
                    >
                      <span>{t('viewDetails')}</span>
                      <ArrowRight className='size-3.5' />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Slider Navigation Arrows */}
            <button
              aria-label='Previous slide'
              className='absolute top-1/2 left-2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200/80 bg-white/90 text-neutral-700 shadow-md backdrop-blur-md transition-all hover:scale-110 hover:bg-white sm:left-3 sm:size-9 dark:border-white/10 dark:bg-neutral-900/90 dark:text-neutral-200 dark:hover:bg-neutral-800'
              onClick={prevSlide}
            >
              <ChevronLeft className='size-4 sm:size-5' />
            </button>

            <button
              aria-label='Next slide'
              className='absolute top-1/2 right-2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200/80 bg-white/90 text-neutral-700 shadow-md backdrop-blur-md transition-all hover:scale-110 hover:bg-white sm:right-3 sm:size-9 dark:border-white/10 dark:bg-neutral-900/90 dark:text-neutral-200 dark:hover:bg-neutral-800'
              onClick={nextSlide}
            >
              <ChevronRight className='size-4 sm:size-5' />
            </button>

            {/* Dots */}
            <div className='mt-4 flex items-center justify-center gap-1.5'>
              {products.map((p, idx) => (
                <button
                  key={p?.id || `dot-${idx}`}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? 'w-7 bg-amber-600 dark:bg-amber-400'
                      : 'w-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700'
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { HeroSection }
