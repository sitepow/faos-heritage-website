/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-array-index-key */
'use client'

import { Button } from '@heroui/react'
import { ChevronLeft, ChevronRight, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useState, useEffect, useCallback } from 'react'

import { BadgeOverlay } from './Product/BadgeOverlay'

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
    <section className='relative w-full py-10 transition-colors duration-300'>
      <div className='flex w-full flex-col gap-8 md:flex-row xl:items-center xl:gap-12'>
        <div className='order-2 flex-1 space-y-4 text-center transition-all duration-500 md:space-y-6 md:px-0 md:text-left'>
          <div className='min-h-[140px] md:min-h-[180px]'>
            <h1 className='text-3xl leading-tight font-bold sm:text-4xl'>
              {currentProduct?.name}
            </h1>

            <p className='mt-3 w-full text-lg tracking-tight opacity-70 sm:text-xl md:mt-4'>
              {currentProduct?.summary ||
                'Selecting the best for your health with premium olive oil and honey.'}
            </p>
          </div>

          <div className='flex flex-col items-center gap-2.5 md:items-start'>
            <Link href={`/products/${currentProduct?.slug}`}>
              <div className='flex items-center gap-2.5 opacity-70 hover:underline hover:opacity-100'>
                <span>Shop Now - {displayPrice}</span>
                <ChevronRightIcon />
              </div>
            </Link>

            <Link href='/products'>
              <div className='flex items-center gap-2.5 opacity-70 hover:underline hover:opacity-100'>
                <span>View All Products</span>
                <ChevronRightIcon />
              </div>
            </Link>
          </div>
        </div>

        <div className='group relative order-1 flex w-full flex-1 items-center justify-center'>
          <div className='relative aspect-square w-full transition-all duration-700 ease-in-out'>
            {currentProduct?.images?.[0]?.url && (
              <div
                key={currentProduct.id}
                className='animate-in fade-in zoom-in relative flex size-full flex-col items-center justify-center duration-500'
              >
                <img
                  alt={currentProduct.name}
                  className='border-default-100 relative z-10 size-full rounded-xl border object-contain drop-shadow-xl md:drop-shadow-2xl dark:drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                  src={currentProduct.images[0].url}
                />

                <div className='flex items-center justify-center gap-2 pt-4 md:justify-start'>
                  {products.map((_, index) => {
                    return (
                      <Button
                        key={index}
                        className={`h-1.5 min-w-0 rounded-full p-0 transition-all md:h-2 ${
                          currentIndex === index
                            ? 'w-6 bg-[#222222] md:w-8'
                            : 'w-1.5 bg-neutral-300 md:w-2 dark:bg-neutral-700'
                        }`}
                        onPress={() => {
                          return setCurrentIndex(index)
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            <BadgeOverlay
              discount={maxDiscountPercentage}
              hasAnyDiscount={currentProduct?.hasAnyDiscount}
            />

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

export { HeroSection }
