import { Card, CardBody } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import Image from 'next/image'

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
          <Image
            alt=''
            className='aspect-square rounded-full object-cover'
            height={38}
            src={item?.image ?? '/placeholder.svg'}
            width={38}
          />
          <span className='truncate'>{item?.name}</span>
        </div>
      </CardBody>
    </Card>
  )
}

const CategoryCardSkeleton = () => {
  return (
    <Skeleton className='size-full rounded-xl'>
      <div className='h-12 rounded-xl bg-default-300' />
    </Skeleton>
  )
}

export { CategoryCard, CategoryCardSkeleton }
