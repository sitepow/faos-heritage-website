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
        'h-6 border-none bg-zinc-100 px-2 text-[10px] font-bold tracking-tighter text-zinc-500 uppercase dark:bg-zinc-800',
        className,
      )}
      radius='full'
      size='sm'
      variant='flat'
    >
      {categoryName}
    </Chip>
  )
}

export { CategoryChip }
