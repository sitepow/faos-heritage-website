/* eslint-disable no-unused-vars */
'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from '@heroui/react'
import { Role } from '@prisma/client'
import {
  HeartIcon,
  LogOutIcon,
  PackageIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import { NO_IMAGE } from '@/utils/constants'
import { ACCOUNT_TAB } from '@/utils/features'

interface NavbarPanelProps {
  setIsMenuOpen: (state: boolean) => void
}

export const NavbarPanel = ({ setIsMenuOpen }: NavbarPanelProps) => {
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
      key: 'order',
      label: 'My orders',
      icon: <PackageIcon className='text-default-500' />,
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
              src: `${user?.image ?? NO_IMAGE}`,
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
