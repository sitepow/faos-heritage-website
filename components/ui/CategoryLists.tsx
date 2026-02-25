/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

import { Container } from '../layouts/Container'

import { IMAGE_FALLBACK } from '@/constants'
import { useCategories } from '@/features/category/category.hook'

const CategoryLists = () => {
  const locale = useLocale()

  const { data: categories } = useCategories({ locale })

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <Container className='flex flex-wrap justify-center gap-5'>
      {categories.map((category) => (
        <Link
          key={category?.id!}
          className='flex cursor-pointer flex-col items-center gap-5'
          href={`/categories/${category?.slug!}`}
        >
          <img
            alt={category?.name!}
            className='size-18 rounded-full object-cover sm:size-32'
            src={category?.image ?? IMAGE_FALLBACK.EMPTY}
          />
          <span className='max-w-3/4 text-center font-medium'>
            {category?.name!}
          </span>
        </Link>
      ))}
    </Container>
  )
}

export { CategoryLists }
