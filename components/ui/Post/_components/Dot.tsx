import type { ComponentProps } from 'react'

import { cn } from '@/utils'

const Dot = ({ className }: ComponentProps<'span'>) => {
  return (
    <span aria-hidden='true' className={cn('text-white/50', className)}>
      ·
    </span>
  )
}

export { Dot }
