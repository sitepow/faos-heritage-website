'use client'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@heroui/react'
import { LogOutIcon, Settings, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const ControlPanel = () => {
  const router = useRouter()
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
          key='account'
          startContent={<UserIcon />}
          onClick={() => {
            router.push('/account')
          }}
        >
          บัญชีของฉัน
        </DropdownItem>
        <DropdownItem
          key='admin-dashboard'
          startContent={<Settings />}
          onClick={() => {
            router.push('/dashboard')
          }}
        >
          จัดการข้อมูลหลังร้าน (เฉพาะเจ้าหน้าที่)
        </DropdownItem>
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

export { ControlPanel }
