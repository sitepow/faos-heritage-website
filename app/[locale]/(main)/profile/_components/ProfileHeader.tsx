import { CardHeader } from '@heroui/react'

interface Props {
  title?: string
}

const ProfileHeader = ({ title }: Props) => {
  return (
    <CardHeader className='border-default-100 flex justify-between border-b'>
      <b className='text-lg'>{title}</b>
    </CardHeader>
  )
}

export { ProfileHeader }
