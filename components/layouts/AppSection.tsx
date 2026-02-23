import type { ComponentProps } from 'react'

import { cn } from '@/utils'

const AppSection = ({ children, className }: ComponentProps<'section'>) => {
  return (
    <section className={cn('flex flex-col gap-10', className)}>
      {children}
    </section>
  )
}

export { AppSection }
