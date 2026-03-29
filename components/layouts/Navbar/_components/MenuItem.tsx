import type { ComponentProps } from 'react'

interface Props extends ComponentProps<'span'> {
  label?: string
}

const MenuItem = ({ label, ...props }: Props) => {
  return (
    <span
      className={`rounded-medium flex cursor-pointer items-center opacity-70 duration-200 hover:opacity-100`}
      {...props}
    >
      {label}
    </span>
  )
}

export { MenuItem }
