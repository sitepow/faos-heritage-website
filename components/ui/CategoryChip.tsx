import { Chip } from '@heroui/react'

import { cn } from '@/utils'

interface Props {
  categoryName?: string
  className?: string
}

const CategoryChip = ({ categoryName, className }: Props) => {
  return (
    <Chip
      className={cn(
        'bg-primary text-tiny h-6 border-none font-bold text-white uppercase',
        className,
      )}
      size='sm'
      variant='flat'
    >
      {categoryName}
    </Chip>
  )
}

export { CategoryChip }
