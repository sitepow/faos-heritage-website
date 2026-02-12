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
    <Container className='flex h-auto w-full flex-wrap overflow-hidden lg:h-[550px] lg:flex-nowrap'>
      {categories?.map(({ name, id, image }) => (
        <div
          key={id}
          className='group border-default-100 relative h-[300px] w-full cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] lg:h-full lg:flex-[1] lg:hover:flex-[4]'
          onClick={() =>
            router.push(`/categories/${generateSlugWithId(name!, id!)}`)
          }
        >
          <img
            alt={name}
            className='size-full object-cover transition-transform duration-700 group-hover:scale-110'
            src={image ?? IMAGE_FALLBACK.EMPTY}
          />

          <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />

          <div className='group-hover:bg-primary/20 absolute bottom-0 left-0 flex w-full items-center justify-center bg-white/10 py-4 backdrop-blur-md transition-all duration-300'>
            <span className='text-sm font-medium tracking-wider text-white uppercase transition-all duration-300 group-hover:scale-110 sm:text-lg'>
              {name}
            </span>
          </div>
        </div>
      ))}
    </Container>
  )
}

export { CategoryLists }
