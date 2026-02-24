/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

import { Container } from '../layouts/Container'

import { IMAGE_FALLBACK } from '@/constants'
import { useCategories } from '@/features/category/category.hook'
import { generateSlugWithId } from '@/utils'

const CategoryLists = () => {
  const router = useRouter()
  const locale = useLocale()

  const { data: categories } = useCategories({ locale })

  if (categories?.length === 0) {
    return
  }

  return (
    <Container className='flex flex-wrap justify-center gap-5'>
      {categories?.map((category) => (
        <div
          key={category?.name!}
          className='flex cursor-pointer flex-col items-center gap-5'
          onClick={() =>
            router.push(
              `/categories/${generateSlugWithId(category?.name!, category?.id!)}`,
            )
          }
        >
          <img
            className='size-18 rounded-full object-cover sm:size-32'
            src={category?.image ?? IMAGE_FALLBACK.EMPTY}
          />
          <span>{category?.name!}</span>
        </div>
      ))}
    </Container>
  )
}

export { CategoryLists }
