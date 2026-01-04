'use client'

import { CardBody, Card, Skeleton } from '@heroui/react'
import Image from 'next/image'

import type { GetCategoryResult } from '@/app/[locale]/(dashboard)/dashboard/product/action/category'
import type { ComponentProps } from 'react'

import { NO_IMAGE } from '@/utils/constants'
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
      className={cn('cursor-pointer', isActive && 'bg-default-100')}
      shadow='none'
    >
      <CardBody {...props}>
        <div className='flex items-center gap-2.5'>
          <Image
            alt=''
            className='aspect-square rounded-full object-cover'
            height={38}
            src={item?.image ?? NO_IMAGE}
            width={38}
          />
          <span className='truncate'>{item?.name}</span>
        </div>
      </CardBody>
    </Card>
  )
}
