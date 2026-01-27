import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/utils/style'

type SectionHeaderProps = ComponentPropsWithoutRef<'div'> & {
  title: ReactNode
  description?: ReactNode
}

const SectionHeader = ({
  title,
  description,
  className,
  ...props
}: SectionHeaderProps) => {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      <h2 className='text-primary text-xl font-semibold tracking-tight sm:text-2xl'>
        {title}
      </h2>

      {description ? (
        <p className='text-primary mx-auto max-w-[75%] sm:text-lg'>
          {description}
        </p>
      ) : null}
    </div>
  )
}

type SectionLabelProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode
}

const SectionLabel = ({ children, className, ...props }: SectionLabelProps) => {
  return (
    <span
      className={cn(
        'border-divider text-default-500 block w-fit border-b pb-1 text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { SectionHeader, SectionLabel }
