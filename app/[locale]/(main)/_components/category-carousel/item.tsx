'use client'

import { CardBody, Card, Skeleton } from '@heroui/react'
import Image from 'next/image'

import type { GetCategoryResult } from '@/app/[locale]/(dashboard)/dashboard/product/action/category'
import type { ComponentProps } from 'react'

import { NO_IMAGE } from '@/utils/constants/seo'
import { cn } from '@/utils/style'

type CategoryCarouselItemProps = ComponentProps<typeof CardBody> & {
  item: GetCategoryResult
  isActive?: boolean
}

export const CategoryCarouselItemSkeleton = () => {
  return <Skeleton className='h-14 w-full rounded-xl' />
}

export const CategoryCarouselItem = ({
  item,
  isActive = false,
  ...props
}: CategoryCarouselItemProps) => {
  return (
    <Card
      isHoverable
      className={cn(
        'border-default-200 w-52 cursor-pointer border',
        isActive && 'bg-default-100',
      )}
      shadow='none'
    >
      <CardBody {...props}>
        <div className='flex flex-col items-center gap-2.5 text-center'>
          <Image
            alt=''
            className='aspect-square size-10 rounded-full object-cover sm:size-12'
            height={60}
            src={item?.image ?? NO_IMAGE}
            width={60}
          />
          <span className='line-clamp-2'>{item?.name}</span>
        </div>
      </CardBody>
    </Card>
  )
}
