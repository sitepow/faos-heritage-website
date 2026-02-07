import type { ComponentProps } from 'react'

interface Props extends ComponentProps<'span'> {
  label?: string
}

const MenuItem = ({ label, ...props }: Props) => {
  return (
    <span
      className='text-default-500 hover:text-foreground cursor-pointer text-lg'
      {...props}
    >
      {label}
    </span>
  )
}

export { MenuItem }
