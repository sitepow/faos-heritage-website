interface Props {
  label?: string
}

const MenuItem = ({ label }: Props) => {
  return (
    <span className='text-default-500 hover:text-foreground cursor-pointer text-lg'>
      {label}
    </span>
  )
}

export { MenuItem }
