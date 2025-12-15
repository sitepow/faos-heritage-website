/* eslint-disable @next/next/no-img-element */
import { Card, CardBody } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'

import type { GetCategoryResult } from '@/app/(dashboard)/dashboard/product/actions/category'
import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

interface Props {
  item: GetCategoryResult
  isActive?: boolean
}

const CategoryCard: FC<ComponentProps<typeof CardBody> & Props> = ({
  item,
  isActive = false,
  ...props
}) => {
  return (
    <Card
      isHoverable
      className={cn('cursor-pointer', isActive && 'bg-default-100')}
      shadow='none'
    >
      <CardBody {...props}>
        <div className='flex items-center gap-2.5'>
          <img
            alt={item?.name}
            className='aspect-square size-[45px] rounded-full object-cover'
            src={item?.image || '/no-image.png'}
          />
          <span className='truncate'>{item?.name}</span>
        </div>
      </CardBody>
    </Card>
  )
}

const CategoryCardSkeleton = () => {
  return <Skeleton className='h-14 w-full rounded-xl' />
}

export { CategoryCard, CategoryCardSkeleton }
