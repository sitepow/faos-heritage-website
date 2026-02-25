import type { ComponentProps } from 'react'

import { cn } from '@/utils'

const AppSection = ({
  children,
  className,
  ...props
}: ComponentProps<'section'>) => {
  return (
    <section className={cn('flex flex-col gap-10', className)} {...props}>
      {children}
    </section>
  )
}

export { AppSection }
