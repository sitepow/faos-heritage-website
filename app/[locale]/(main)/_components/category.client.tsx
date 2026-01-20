/* eslint-disable @next/next/no-img-element */
'use client'

import { Card, CardBody, CardHeader } from '@heroui/react'
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
    <Card radius='none' shadow='none' className='container mx-auto bg-inherit'>
      <CardHeader className='dark:bg-default-50 bg-white py-5 font-semibold'>
        <span className='text-[#0000008a] dark:text-[#ffffff8a]'>หมวดหมู่</span>
      </CardHeader>
      <CardBody className='grid grid-cols-2 gap-px p-px text-center sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6'>
        {categories?.map((category) => (
          <div
            className='hover:text-primary dark:bg-default-50 flex h-36 cursor-pointer flex-col items-center justify-center gap-2 bg-white p-2'
            onClick={() => {
              router.push(
                `/category/${createSlug(category?.name, category?.id)}`,
              )
            }}
          >
            <img
              src={category?.image ?? NO_IMAGE}
              className='size-14 rounded-full sm:size-16'
            />
            <span className='line-clamp-2'>{category?.name}</span>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}
