import type { ComponentProps } from 'react'

interface Props extends ComponentProps<'span'> {
  label?: string
}

const MenuItem = ({ label, ...props }: Props) => {
  return (
    <span
      className={`rounded-medium flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-lg transition-colors duration-200 select-none`}
      {...props}
    >
      {label}
    </span>
  )
}

export { MenuItem }
