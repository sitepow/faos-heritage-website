/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
'use client'

import { Button } from '@heroui/react'
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
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
    setCurrentIndex((prev) => {
      return prev === products.length - 1 ? 0 : prev + 1
    })
  }, [products.length])

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      return prev === 0 ? products.length - 1 : prev - 1
    })
  }

  useEffect(() => {
    if (products.length <= 1) {
      return
    }

    const timer = setInterval(nextSlide, 10000)
    return () => {
      return clearInterval(timer)
    }
  }, [nextSlide, products.length])

  if (isLoading || products.length === 0) {
    return (
      <div className='flex h-[500px] w-full animate-pulse items-center justify-center bg-gray-50 md:h-[600px] dark:bg-neutral-900' />
    )
  }

  return (
    <section className='relative w-full transition-colors duration-300'>
      <div className='flex w-full flex-col gap-8 xl:flex-row xl:items-center xl:gap-12'>
        <div className='order-2 flex-1 space-y-4 px-4 text-center transition-all duration-500 md:space-y-6 md:px-0 md:text-left xl:order-1'>
          <div className='min-h-[140px] md:min-h-[180px]'>
            <h1 className='text-3xl leading-tight font-bold text-neutral-900 md:text-6xl dark:text-neutral-50'>
              {currentProduct?.name.split(' ').map((word, i) => {
                return i === 0 ? (
                  <span key={i}>
                    {word} <br className='hidden md:block' />
                  </span>
                ) : (
                  <span key={i} className='text-green-600 dark:text-green-500'>
                    {word}{' '}
                  </span>
                )
              })}
            </h1>

            <p className='mt-3 w-full text-base text-neutral-900 opacity-50 md:mt-4 md:text-lg dark:text-neutral-50'>
              {currentProduct?.summary ||
                'Selecting the best for your health with premium olive oil and honey.'}
            </p>
          </div>

          <div className='flex flex-col items-center gap-3 pt-2 md:gap-4 md:pt-4 xl:flex-row'>
            <Button
              as={Link}
              className='flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3.5 font-semibold text-neutral-700 transition-all md:px-8 md:py-4 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
              href={`/products/${currentProduct?.slug}`}
              size='lg'
              startContent={<ShoppingCart size={18} />}
            >
              Shop Now - {displayPrice}
            </Button>
            <Button
              as={Link}
              className='flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3.5 font-semibold text-neutral-700 transition-all md:px-8 md:py-4 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
              endContent={<ArrowRight size={18} />}
              href='/products'
              size='lg'
            >
              View All Products
            </Button>
          </div>

          <div className='flex items-center justify-center gap-2 pt-4 md:justify-start'>
            {products.map((_, index) => {
              return (
                <Button
                  key={index}
                  className={`h-1.5 min-w-0 rounded-full p-0 transition-all md:h-2 ${
                    currentIndex === index
                      ? 'w-6 bg-green-600 md:w-8 dark:bg-green-500'
                      : 'w-1.5 bg-neutral-300 md:w-2 dark:bg-neutral-700'
                  }`}
                  onClick={() => {
                    return setCurrentIndex(index)
                  }}
                />
              )
            })}
          </div>
        </div>

        <div className='group relative order-1 flex w-full flex-1 items-center justify-center xl:order-2'>
          <div className='relative aspect-square w-full transition-all duration-700 ease-in-out md:max-w-[380px] xl:max-w-[480px]'>
            {currentProduct?.images?.[0]?.url && (
              <div
                key={currentProduct.id}
                className='animate-in fade-in zoom-in relative h-full w-full duration-500'
              >
                <img
                  alt={currentProduct.name}
                  className='relative z-10 size-full object-contain drop-shadow-xl md:drop-shadow-2xl dark:drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                  src={currentProduct.images[0].url}
                />
              </div>
            )}

            <div className='absolute -top-2 -right-2 z-20 flex gap-2 md:top-8 md:right-8'>
              {maxDiscountPercentage > 0 && (
                <div className='flex h-14 w-14 rotate-12 animate-bounce flex-col items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white shadow-lg md:h-20 md:w-20 md:border-4 dark:border-neutral-900'>
                  <span className='text-[8px] leading-none md:text-[10px]'>
                    UP TO
                  </span>
                  <span className='text-sm md:text-xl'>
                    {maxDiscountPercentage}%
                  </span>
                </div>
              )}

              <div className='flex h-14 w-14 rotate-12 animate-bounce flex-col items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white shadow-lg md:h-20 md:w-20 md:border-4 dark:border-neutral-900'>
                <span className='text-[8px] leading-none md:text-[10px]'>
                  SHOP
                  <br />
                  NOW!
                </span>
              </div>
            </div>

            <Button
              isIconOnly
              className='absolute top-1/2 left-2 z-30 min-w-0 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-all hover:bg-white xl:p-2 xl:opacity-0 xl:group-hover:opacity-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-700'
              onClick={prevSlide}
            >
              <ChevronLeft
                className='text-neutral-600 dark:text-neutral-300'
                size={20}
              />
            </Button>
            <Button
              isIconOnly
              className='absolute top-1/2 right-2 z-30 min-w-0 -translate-y-1/2 rounded-full bg-white/80 p-1.5 shadow-md transition-all hover:bg-white xl:p-2 xl:opacity-0 xl:group-hover:opacity-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-700'
              onClick={nextSlide}
            >
              <ChevronRight
                className='text-neutral-600 dark:text-neutral-300'
                size={20}
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
