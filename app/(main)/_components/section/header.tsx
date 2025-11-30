import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

interface HeaderProps {
  title: string
  description: string
}

const Header: FC<ComponentProps<'div'> & HeaderProps> = ({
  title,
  description,
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      <h2 className='text-2xl font-bold'>{title}</h2>
      <span className='text-default-500'>{description}</span>
    </div>
  )
}

interface SubHeaderProps {
  title: string
}

const SubHeader: FC<ComponentProps<'span'> & SubHeaderProps> = ({ title, className, ...props }) => {
  return (
    <span className={cn('w-fit border-b border-divider pb-1', className)} {...props}>
      {title}
    </span>
  )
}

export { Header, SubHeader }
