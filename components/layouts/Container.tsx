import type { ComponentProps } from 'react'

import { cn } from '@/utils'

interface ContainerProps extends ComponentProps<'div'> {
  className?: string
}

const Container = ({ children, className }: ContainerProps) => {
  return <div className={cn('container mx-auto', className)}>{children}</div>
}

export { Container }
