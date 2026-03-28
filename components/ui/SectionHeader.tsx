import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/utils/style'

type SectionHeaderProps = ComponentPropsWithoutRef<'div'> & {
  title: ReactNode
  description?: ReactNode
  as?: 'h1' | 'h2' | 'h3'
}

type SectionLabelProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode
}

const SectionHeader = ({
  title,
  description,
  className,
  as: Tag = 'h2',
  ...props
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center space-y-1 text-center',
        className,
      )}
      {...props}
    >
      <Tag className='text-xl font-semibold tracking-tight sm:text-2xl'>
        {title}
      </Tag>

      {description ? (
        <p className='bg-red-5 mx-auto max-w-[75%] text-lg opacity-60 sm:text-xl lg:max-w-[45%]'>
          {description}
        </p>
      ) : null}
    </div>
  )
}
const SectionLabel = ({ children, className, ...props }: SectionLabelProps) => {
  return (
    <span
      className={cn(
        'border-default-100 text-default-500 block w-fit border-b pb-1 text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { SectionHeader, SectionLabel }
