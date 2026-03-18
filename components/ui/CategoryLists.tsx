/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

import { Container } from '../layouts/Container'

import { IMAGE_FALLBACK } from '@/constants'
import { useCategories } from '@/features/category/hook'

const CategoryLists = () => {
  const locale = useLocale()
  const { data: categories } = useCategories({ locale })

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <Container className='grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8'>
      {categories.map((category) => (
        <Link
          key={category?.id!}
          className='group flex cursor-pointer flex-col items-center gap-4 transition-transform hover:-translate-y-1'
          href={`/categories/${category?.slug!}`}
        >
          <div className='group-hover:border-primary relative overflow-hidden rounded-full border-2 border-transparent transition-colors'>
            <img
              alt={category?.name!}
              className='size-20 object-cover transition-transform duration-500 group-hover:scale-110 sm:size-32'
              src={category?.image ?? IMAGE_FALLBACK.EMPTY}
            />
          </div>
          <span className='group-hover:text-primary line-clamp-2 text-center text-sm font-medium transition-colors sm:text-base'>
            {category?.name!}
          </span>
        </Link>
      ))}
    </Container>
  )
}

export { CategoryLists }
