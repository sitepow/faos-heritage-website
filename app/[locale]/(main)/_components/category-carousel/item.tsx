'use client'

import { CardBody, Card, Skeleton } from '@heroui/react'

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
      className={cn(
        'border-default-200 w-32 cursor-pointer border font-semibold sm:w-52',
        isActive && 'border-primary text-primary',
      )}
    >
      <CardBody {...props}>
        <div className='flex flex-col items-center gap-2.5 text-center'>
          <img
            alt=''
            className='aspect-square size-12 rounded-full object-cover'
            height={60}
            src={item?.image ?? NO_IMAGE}
            width={60}
          />
          <span className='line-clamp-1'>{item?.name}</span>
        </div>
      </CardBody>
    </Card>
  )
}
