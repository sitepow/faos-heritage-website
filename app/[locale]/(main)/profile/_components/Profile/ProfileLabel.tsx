interface Props {
  label: string
}

const ProfileLabel = ({ label }: Props) => {
  return <span className='text-xl font-semibold'>{label}</span>
}

export { ProfileLabel }
