import { CardHeader } from '@heroui/react'

import type { PropsWithChildren } from 'react'

const ProfileHeader = ({ children }: PropsWithChildren) => {
  return (
    <CardHeader className='border-default-100 flex justify-between border-b'>
      {children}
    </CardHeader>
  )
}

export { ProfileHeader }
