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
      label: 'My account',
      icon: <UserIcon className='text-default-500' />,
      action: () => router.push(`/account?tab=${ACCOUNT_TAB?.ACCOUNT}`),
    },
    {
      key: 'account',
      label: 'My orders',
      icon: <UserIcon className='text-default-500' />,
      action: () => router.push(`/account?tab=${ACCOUNT_TAB?.ORDER}`),
    },
    {
      key: 'favorite',
      label: 'Favorites',
      icon: <HeartIcon className='text-default-500' />,
      action: () => router.push(`/account?tab=${ACCOUNT_TAB?.FAVORITE}`),
    },
    ...(isAdmin && !isDashboard
      ? [
          {
            key: 'admin-dashboard',
            label: 'Admin dashboard',
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
              src: `${user?.image ?? '/no-image.png'}`,
            }}
            className='hidden cursor-pointer sm:flex'
            description={user?.email}
            name={user?.name}
          />

          <UserIcon className='text-default-400 sm:hidden' />
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
