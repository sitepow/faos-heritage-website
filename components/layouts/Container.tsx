import type { ComponentProps } from 'react'

import { cn } from '@/utils'

interface Props extends ComponentProps<'div'> {
  className?: string
}

const Container = ({ children, className }: Props) => {
  return <div className={cn('container mx-auto', className)}>{children}</div>
}

export { Container }
