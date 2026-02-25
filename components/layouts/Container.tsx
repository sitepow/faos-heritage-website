import type { ComponentProps } from 'react'

import { cn } from '@/utils'

const Container = ({
  children,
  className,
  ...props
}: ComponentProps<'div'>) => {
  return (
    <div className={cn('container mx-auto', className)} {...props}>
      {children}
    </div>
  )
}

export { Container }
