import { Card, CardBody } from '@heroui/card'
import { LayoutGrid } from 'lucide-react'

import type { CategoryItem } from '@/types'
import type { FC } from 'react'

interface Props {
  item: CategoryItem
}

const CategoryItem: FC<Props> = ({ item }) => {
  return (
    <Card isHoverable className='cursor-pointer' shadow='sm'>
      <CardBody>
        <div className='flex gap-2.5'>
          <LayoutGrid className='text-divider' />
          <span className='truncate'>{item.name}</span>
        </div>
      </CardBody>
    </Card>
  )
}

export { CategoryItem }
