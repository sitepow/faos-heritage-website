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
    <Container className='flex flex-wrap justify-center gap-5'>
      {categories.map((category) => (
        <Link key={category?.id!} href={`/categories/${category?.slug!}`}>
          <div className='flex w-34 flex-col items-center justify-center gap-2.5 lg:w-42'>
            <img
              alt={category?.name!}
              className='border-default-100 size-28 rounded-full border object-cover lg:size-42'
              src={category?.image ?? IMAGE_FALLBACK.EMPTY}
            />
            <span className='text-center text-lg sm:text-xl'>
              {category?.name!}
            </span>
          </div>
        </Link>
      ))}
    </Container>
  )
}

export { CategoryLists }
