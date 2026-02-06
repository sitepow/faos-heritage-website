/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter } from 'next/navigation'

import { IMAGE_FALLBACK } from '@/constants'
import { useCategories } from '@/features/category/useCategory'
import { generateSlugWithId } from '@/utils'

const CategoryLists = () => {
  const router = useRouter()
  const { data: categories } = useCategories()

  return (
    <div className='container mx-auto flex h-auto w-full flex-wrap overflow-hidden lg:h-[550px] lg:flex-nowrap'>
      {categories?.map((category) => (
        <div
          key={category.id}
          className='group border-default-100 relative h-[180px] w-full cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] lg:h-full lg:flex-[1] lg:hover:flex-[4]'
          onClick={() =>
            router.push(
              `/categories/${generateSlugWithId(category.name, category.id)}`,
            )
          }
        >
          <img
            alt={category.name}
            className='size-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0'
            src={category?.image ?? IMAGE_FALLBACK.EMPTY}
          />
          <div className='from-primary/80 via-primary/20 absolute inset-0 bg-gradient-to-t to-transparent opacity-60 transition-opacity group-hover:opacity-90' />

          <div className='absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0'>
            <span className='text-xl whitespace-nowrap text-white/70 uppercase'>
              {category?.name}
            </span>
          </div>

          <div className='absolute inset-0 flex items-center justify-center p-8 uppercase opacity-0 duration-300 group-hover:opacity-100'>
            <h3 className='translate-y-10 text-3xl text-white transition-transform duration-300 group-hover:translate-y-0 sm:text-4xl'>
              {category?.name}
            </h3>
          </div>

          <div className='border-primary absolute inset-0 border-0 transition-all duration-300 group-hover:border-4' />
        </div>
      ))}
    </div>
  )
}

export { CategoryLists }
