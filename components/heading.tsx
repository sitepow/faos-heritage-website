import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils/style'

type SectionHeaderProps = ComponentPropsWithoutRef<'div'> & {
  title: string
  description?: string
}

type SubHeadingProps = ComponentPropsWithoutRef<'span'> & {
  title: string
}

export const SectionHeader = ({
  title,
  description,
  className,
  ...props
}: SectionHeaderProps) => {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      <h2 className='text-xl tracking-tight sm:text-2xl'>{title}</h2>
      {description && (
        <p className='text-default-500 mx-auto sm:max-w-2/3 sm:text-lg'>
          {description}
        </p>
      )}
    </div>
  )
}

export const SubHeading = ({ title, className, ...props }: SubHeadingProps) => {
  return (
    <span
      className={cn(
        'border-divider text-default-500 block w-fit border-b pb-1 text-sm',
        className,
      )}
      {...props}
    >
      {title}
    </span>
  )
}
