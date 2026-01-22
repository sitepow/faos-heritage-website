'use client'

import { Card, CardHeader } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

import { NO_IMAGE } from '@/utils/constants/seo'
import { createSlug } from '@/utils/helpers/slug'

export const CategoryClient = () => {
  const tc = useTranslations('Common')
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
            {tc('category')}
          </span>
        </CardHeader>
      </Card>

      <div className='flex flex-wrap justify-center gap-5'>
        {categories?.map((category) => (
          <div
            key={category.id}
            onClick={() =>
              router.push(`/category/${createSlug(category.name, category.id)}`)
            }
            className='group flex w-28 cursor-pointer flex-col items-center gap-2 sm:w-32'
          >
            <div className='relative overflow-hidden rounded-2xl'>
              <img
                src={category?.image ?? NO_IMAGE}
                alt={category.name}
                className='border-divider aspect-square size-14 w-full rounded-full border object-cover md:size-16'
              />
            </div>
            <span className='group-hover:text-primary line-clamp-1 font-medium'>
              {category?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
