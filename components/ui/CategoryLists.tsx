/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter } from 'next/navigation'

import { Container } from '../layouts/Container'

import { IMAGE_FALLBACK } from '@/constants'
import { useCategories } from '@/features/category/useCategory'
import { generateSlugWithId } from '@/utils'

const CategoryLists = () => {
  const router = useRouter()
  const { data: categories } = useCategories()

  if (categories?.length === 0) {
    return
  }

  return (
    <Container className='flex flex-wrap justify-center gap-5'>
      {categories?.map(({ name, id, image }) => (
        <div
          key={name}
          className='flex cursor-pointer flex-col items-center gap-5'
          onClick={() =>
            router.push(`/categories/${generateSlugWithId(name!, id!)}`)
          }
        >
          <img
            className='size-32 rounded-full object-cover'
            src={image ?? IMAGE_FALLBACK.EMPTY}
          />
          <span>{name}</span>
        </div>
      ))}
    </Container>
  )
}

export { CategoryLists }
