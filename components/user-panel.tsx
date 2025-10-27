'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown'
import { User } from '@heroui/user'
import { LogOutIcon } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

const UserPanel = () => {
  const { data: session } = useSession()

  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          avatarProps={{
            src: '/placeholder.svg',
          }}
          className='cursor-pointer'
          description={session?.user?.email}
          name={session?.user?.name}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        <DropdownItem
          key='logout'
          className='text-danger'
          color='danger'
          startContent={<LogOutIcon />}
          onClick={signOut}
        >
          ออกจากระบบ
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export { UserPanel }
