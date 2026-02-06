import type { ComponentProps, ElementType } from 'react'

import { cn } from '@/utils'

interface CustomIconProps extends ComponentProps<'svg'> {
  icon: ElementType
  className?: string
}

const CustomIcon = ({ icon: Icon, className, ...props }: CustomIconProps) => {
  return <Icon className={cn('text-default-500', className)} {...props} />
}

export { CustomIcon }
