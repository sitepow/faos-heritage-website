import clsx from 'clsx'

import type { ComponentProps, FC } from 'react'

interface Props {
  title: string
  description: string
}

const HomePageHeaderTitle: FC<ComponentProps<'div'> & Props> = ({
  title,
  description,
  className,
  ...props
}) => {
  return (
    <div className={clsx(className)} {...props}>
      <h2 className='text-2xl font-bold'>{title}</h2>
      <span>{description}</span>
    </div>
  )
}

export { HomePageHeaderTitle }
