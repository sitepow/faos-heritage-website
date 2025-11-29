import { Card, CardBody } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { LayoutGridIcon } from 'lucide-react'

import type { CategoryCard } from '@/types'
import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

interface Props {
  item: CategoryCard
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
        <div className='flex gap-2.5'>
          <LayoutGridIcon className='text-divider' />
          <span className='truncate'>{item.name}</span>
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
