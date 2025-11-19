import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

interface Props {
  title: string
  description: string
}

const Header: FC<ComponentProps<'div'> & Props> = ({
  title,
  description,
  className,
  ...props
}) => {
  return (
    <div className={cn(className)} {...props}>
      <h2 className='text-2xl font-bold'>{title}</h2>
      <span>{description}</span>
    </div>
  )
}

export { Header }
