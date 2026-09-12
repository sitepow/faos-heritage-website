/* eslint-disable @next/next/no-img-element */
'use client'

import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

import { Container } from '../layouts/Container'

import { IMAGE_FALLBACK } from '@/constants'
import { useCategories } from '@/features/category/hook'
import { useGsapReveal } from '@/hooks/useGsap'

const CategoryLists = () => {
  const locale = useLocale()
  const { data: categories } = useCategories({ locale })
  const containerRef = useGsapReveal({ stagger: 0.1, y: 25 })

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <Container
      ref={containerRef}
      className='flex flex-wrap justify-center gap-4 sm:gap-6'
    >
      {categories.map((category) => (
        <Link
          key={category?.id!}
          className='gsap-reveal group relative flex w-36 flex-col items-center overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10 sm:w-44 lg:w-48 dark:border-white/10 dark:bg-neutral-900/60 dark:hover:border-amber-400/50'
          href={`/categories/${category?.slug!}`}
        >
          {/* Subtle hover corner arrow */}
          <div className='absolute top-2.5 right-2.5 rounded-full p-1 text-neutral-400 opacity-0 transition-all duration-300 group-hover:bg-amber-500/10 group-hover:text-amber-600 group-hover:opacity-100 dark:group-hover:text-amber-400'>
            <ArrowUpRight size={14} />
          </div>

          <div className='relative size-24 overflow-hidden rounded-full border-2 border-amber-500/20 p-1 sm:size-28 lg:size-32'>
            <img
              alt={category?.name!}
              className='size-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110'
              src={category?.image ?? IMAGE_FALLBACK.EMPTY}
            />
          </div>

          <span className='mt-3.5 text-center text-sm font-semibold tracking-tight text-neutral-800 transition-colors group-hover:text-amber-700 sm:text-base dark:text-neutral-200 dark:group-hover:text-amber-300'>
            {category?.name!}
          </span>
        </Link>
      ))}
    </Container>
  )
}

export { CategoryLists }
