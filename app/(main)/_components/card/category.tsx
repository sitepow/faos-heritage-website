import { Card, CardBody } from '@heroui/react'
import { LayoutGridIcon } from 'lucide-react'

import type { CategoryCard } from '@/types'
import type { FC } from 'react'

interface Props {
  item: CategoryCard
}

const CategoryCard: FC<Props> = ({ item }) => {
  return (
    <Card isHoverable className='cursor-pointer' shadow='sm'>
      <CardBody>
        <div className='flex gap-2.5'>
          <LayoutGridIcon className='text-divider' />
          <span className='truncate'>{item.name}</span>
        </div>
      </CardBody>
    </Card>
  )
}

export { CategoryCard }
