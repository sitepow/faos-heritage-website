import { Avatar } from '@heroui/avatar'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import { User } from '@heroui/user'
import { Role } from '@prisma/client'
import { HeartIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import type { FC } from 'react'

import { ACCOUNT_TAB } from '@/utils/const'

interface Props {
  setIsMenuOpen: (state: boolean) => void
}

const Panel: FC<Props> = ({ setIsMenuOpen }) => {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const isAdmin = user?.role === Role.ADMIN
  const isDashboard = usePathname().startsWith('/dashboard')

  const menuItems = [
    {
      key: 'account',
      label: 'Manage my account',
      icon: <UserIcon className='text-default-500' />,
      action: () => router.push('/account'),
    },
    {
      key: 'favorite',
      label: 'Manage favorites',
      icon: <HeartIcon className='text-default-500' />,
      action: () => router.push(`/account?tab=${ACCOUNT_TAB?.FAVORITE}`),
    },
    ...(isAdmin && !isDashboard
      ? [
          {
            key: 'admin-dashboard',
            label: 'Manage back-end data (for staff only)',
            icon: <SettingsIcon className='text-default-500' />,
            action: () => router.push('/dashboard'),
          },
        ]
      : []),
    {
      key: 'logout',
      label: 'Log out',
      icon: <LogOutIcon />,
      color: 'danger',
      className: 'text-danger',
      action: () => signOut(),
    },
  ]

  return (
    <Dropdown>
      <DropdownTrigger>
        <div>
          <User
            avatarProps={{
              src: `${user?.image ?? '/placeholder.svg'}`,
            }}
            className='hidden cursor-pointer sm:flex'
            description={user?.email}
            name={user?.name}
          />

          <Avatar
            className='sm:hidden'
            src={`${user?.image ?? '/placeholder.svg'}`}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        {menuItems.map((item) => (
          <DropdownItem
            key={item.key}
            className={item.className}
            startContent={item.icon}
            onClick={() => {
              item.action()
              setIsMenuOpen(false)
            }}
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export { Panel }
