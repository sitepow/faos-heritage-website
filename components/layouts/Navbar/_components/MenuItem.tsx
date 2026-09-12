import type { ComponentProps } from 'react'

import { cn } from '@/utils'

interface Props extends ComponentProps<'span'> {
  label?: string
  isActive?: boolean
}

const MenuItem = ({ label, isActive, className, ...props }: Props) => {
  return (
    <span
      className={cn(
        'inline-flex cursor-pointer items-center text-sm font-medium transition-colors select-none',
        isActive
          ? 'font-semibold text-[#ba8c25] dark:text-[#f59e0b]'
          : 'text-neutral-700 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:text-[#f59e0b]',
        className,
      )}
      {...props}
    >
      {label}
    </span>
  )
}

export { MenuItem }
