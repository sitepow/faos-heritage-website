'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
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
import { useTranslations } from 'next-intl'

import { ACCOUNT_TAB } from '@/utils/constants/account'

export const NavbarPanel = () => {
  const t = useTranslations('Navbar.Panel')
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const isAdmin = user?.role === Role.ADMIN
  const isDashboard = usePathname().startsWith('/dashboard')

  const menuItems = [
    {
      key: 'account',
      label: 'account',
      icon: <UserIcon className='text-default-500' />,
      action: () => router.push(`/account?tab=${ACCOUNT_TAB.ACCOUNT}`),
    },
    {
      key: 'order',
      label: 'orders',
      icon: <PackageIcon className='text-default-500' />,
      action: () => router.push(`/account?tab=${ACCOUNT_TAB.ORDER}`),
    },
    {
      key: 'favorite',
      label: 'favorites',
      icon: <HeartIcon className='text-default-500' />,
      action: () => router.push(`/account?tab=${ACCOUNT_TAB.FAVORITE}`),
    },
    ...(isAdmin && !isDashboard
      ? [
          {
            key: 'dashboard',
            label: 'adminDashboard',
            icon: <SettingsIcon className='text-default-500' />,
            action: () => router.push('/dashboard'),
          },
        ]
      : []),
    {
      key: 'logout',
      label: 'logout',
      icon: <LogOutIcon />,
      color: 'danger',
      className: 'text-danger',
      action: () => signOut(),
    },
  ]

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant='light'>
          <UserIcon />
        </Button>
      </DropdownTrigger>

      <DropdownMenu aria-label='User menu'>
        {menuItems.map((item) => (
          <DropdownItem
            key={item.key}
            className={item.className}
            startContent={item.icon}
            onClick={() => {
              item.action()
            }}
          >
            {t(item.label)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
