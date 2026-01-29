/* eslint-disable @next/next/no-img-element */
'use client'

import { useRouter } from 'next/navigation'

import { IMAGE_FALLBACK } from '@/constants/app'
import { useCategories } from '@/features/category/useCategory'
import { generateSlugWithId } from '@/utils/app'

const CategoryLists = () => {
  const router = useRouter()
  const { data: categories } = useCategories()

  return (
    <div className='container mx-auto flex h-auto w-full flex-wrap gap-4 overflow-hidden p-4 lg:h-[550px] lg:flex-nowrap'>
      {categories?.map((category) => (
        <div
          key={category.id}
          className='group border-divider relative h-[180px] w-full cursor-pointer overflow-hidden rounded-lg border transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] lg:h-full lg:flex-[1] lg:hover:flex-[4]'
          onClick={() =>
            router.push(
              `/categories/${generateSlugWithId(category.name, category.id)}`,
            )
          }
        >
          <img
            alt={category.name}
            className='size-full object-cover grayscale transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0'
            src={category?.image ?? IMAGE_FALLBACK.EMPTY}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-90' />
          <div className='absolute bottom-2.5 left-2.5 flex size-fit items-center justify-center transition-opacity duration-300 group-hover:opacity-0'>
            <span className='text-xl font-bold tracking-[0.1em] whitespace-nowrap text-white/70 uppercase'>
              {category?.name}
            </span>
          </div>
          <div className='absolute bottom-0 left-0 flex translate-y-10 items-center justify-center p-8 uppercase opacity-0 duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
            <h3 className='text-3xl font-black text-white sm:text-4xl'>
              {category?.name}
            </h3>
          </div>
          <div className='border-primary absolute inset-0 rounded-lg border-0 transition-all duration-300 group-hover:border-4' />
        </div>
      ))}
    </div>
  )
}

export { CategoryLists }
