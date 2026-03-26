/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
'use client'

import {
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useState, useEffect, useCallback } from 'react'

import { useProductPrice, useProducts } from '@/features/product/hook'

const HeroSection = () => {
  const locale = useLocale()
  const [currentIndex, setCurrentIndex] = useState(0)

  const { data, isLoading } = useProducts({
    locale,
    itemsPerPage: 5,
  })

  const products = data?.items ?? []
  const currentProduct = products[currentIndex]

  const { displayPrice, maxDiscountPercentage } =
    useProductPrice(currentProduct)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }, [products.length])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (products.length <= 1) {
      return
    }

    const timer = setInterval(nextSlide, 10000)
    return () => clearInterval(timer)
  }, [nextSlide, products.length])

  if (isLoading || products.length === 0) {
    return (
      <div className='flex h-[500px] w-full animate-pulse items-center justify-center bg-gray-50 md:h-[600px] dark:bg-neutral-900' />
    )
  }

  return (
    <section className='relative w-full overflow-hidden py-8 transition-colors duration-300 xl:py-20'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col items-center gap-8 xl:flex-row xl:gap-12'>
          <div className='order-2 flex-1 space-y-4 text-center transition-all duration-500 md:space-y-6 md:text-left xl:order-1'>
            <div className='inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 md:text-sm dark:bg-green-900/30 dark:text-green-400'>
              <ShieldCheck className='md:size-4' size={14} />
              <span>100% Organic Products from Greece</span>
            </div>

            <div className='min-h-[140px] md:min-h-[180px]'>
              <h1 className='text-3xl leading-tight font-bold text-neutral-900 md:text-6xl dark:text-neutral-50'>
                {currentProduct?.name.split(' ').map((word, i) =>
                  i === 0 ? (
                    <span key={i}>
                      {word} <br className='hidden md:block' />
                    </span>
                  ) : (
                    <span
                      key={i}
                      className='text-green-600 dark:text-green-500'
                    >
                      {word}{' '}
                    </span>
                  ),
                )}
              </h1>
              <p className='mt-3 max-w-xl text-base text-neutral-600 md:mt-4 md:text-lg dark:text-neutral-400'>
                {currentProduct?.summary ||
                  'Selecting the best for your health with premium olive oil and honey.'}
              </p>
            </div>

            <div className='flex flex-col items-center gap-3 pt-2 md:gap-4 md:pt-4 xl:flex-row'>
              <Link
                className='flex w-full transform flex-wrap items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-green-200 transition-all hover:scale-105 hover:bg-green-700 md:px-8 md:py-4 dark:shadow-none'
                href={`/products/${currentProduct?.slug}`}
              >
                <ShoppingCart size={18} />
                Shop Now - {displayPrice}
              </Link>
              <Link
                className='flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3.5 font-semibold text-neutral-700 transition-all md:px-8 md:py-4 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
                href='/products'
              >
                View All Products
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className='flex items-center justify-center gap-2 pt-4 md:justify-start'>
              {products.map((_, index) => (
                <button
                  key={index}
                  className={`h-1.5 rounded-full transition-all md:h-2 ${
                    currentIndex === index
                      ? 'w-6 bg-green-600 md:w-8 dark:bg-green-500'
                      : 'w-1.5 bg-neutral-300 md:w-2 dark:bg-neutral-700'
                  }`}
                  type='button'
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className='group relative order-1 flex w-full flex-1 items-center justify-center xl:order-2'>
            <div className='relative mx-auto aspect-square w-full max-w-[280px] transition-all duration-700 ease-in-out md:max-w-[380px] xl:max-w-[480px]'>
              <div className='absolute inset-0 animate-pulse rounded-full bg-green-100 opacity-40 blur-2xl filter md:blur-3xl dark:bg-green-900/20' />

              {currentProduct?.images?.[0]?.url && (
                <div
                  key={currentProduct.id}
                  className='animate-in fade-in zoom-in relative h-full w-full duration-500'
                >
                  <img
                    alt={currentProduct.name}
                    className='relative z-10 h-full w-full object-cover drop-shadow-xl md:drop-shadow-2xl dark:drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                    src={currentProduct.images[0].url}
                  />
                </div>
              )}

              {maxDiscountPercentage > 0 && (
                <div className='absolute -top-2 -right-2 z-20 flex h-14 w-14 rotate-12 animate-bounce flex-col items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white shadow-lg md:top-8 md:right-8 md:h-20 md:w-20 md:border-4 dark:border-neutral-900'>
                  <span className='text-[8px] leading-none md:text-[10px]'>
                    UP TO
                  </span>
                  <span className='text-sm md:text-xl'>
                    {maxDiscountPercentage}%
                  </span>
                </div>
              )}

              <button
                className='absolute top-1/2 left-0 z-30 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-all hover:bg-white xl:p-2 xl:opacity-0 xl:group-hover:opacity-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-700'
                type='button'
                onClick={prevSlide}
              >
                <ChevronLeft
                  className='text-neutral-600 dark:text-neutral-300'
                  size={20}
                />
              </button>
              <button
                className='absolute top-1/2 right-0 z-30 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-all hover:bg-white xl:p-2 xl:opacity-0 xl:group-hover:opacity-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-700'
                type='button'
                onClick={nextSlide}
              >
                <ChevronRight
                  className='text-neutral-600 dark:text-neutral-300'
                  size={20}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
