import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils/style'

interface SectionHeaderProps extends ComponentPropsWithoutRef<'div'> {
  title: string
  description?: string
}

const SectionHeader = ({
  title,
  description,
  className,
  ...props
}: SectionHeaderProps) => {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
      {description && <p className='text-sm text-default-500'>{description}</p>}
    </div>
  )
}

interface SubHeadingProps extends ComponentPropsWithoutRef<'span'> {
  title: string
}

const SubHeading = ({ title, className, ...props }: SubHeadingProps) => {
  return (
    <span
      className={cn(
        'block w-fit border-b border-divider pb-1 text-sm text-default-500',
        className,
      )}
      {...props}
    >
      {title}
    </span>
  )
}

export { SectionHeader, SubHeading }
