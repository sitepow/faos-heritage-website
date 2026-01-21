'use client'

import { Card, CardHeader } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

import { NO_IMAGE } from '@/utils/constants/seo'
import { createSlug } from '@/utils/helpers/slug'

export const CategoryClient = () => {
  const router = useRouter()
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  return (
    <div className='container mx-auto flex flex-col gap-5'>
      <Card radius='none' shadow='none' className='bg-inherit'>
        <CardHeader className='dark:bg-default-50 border-primary border-b-4 bg-white py-5 font-semibold'>
          <span className='text-primary mx-auto text-xl font-bold sm:text-2xl'>
            หมวดหมู่
          </span>
        </CardHeader>
      </Card>

      <div className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'>
        {categories?.map((category) => (
          <div
            key={category.id}
            onClick={() =>
              router.push(`/category/${createSlug(category.name, category.id)}`)
            }
            className='group flex cursor-pointer flex-col items-center gap-2'
          >
            <div className='relative overflow-hidden rounded-2xl'>
              <img
                src={category?.image ?? NO_IMAGE}
                alt={category.name}
                className='border-divider aspect-square size-16 w-full rounded-full border object-cover md:size-20'
              />
            </div>
            <span className='text-default-600 group-hover:text-primary line-clamp-1 text-sm font-medium transition-colors'>
              {category?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
