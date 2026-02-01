/* eslint-disable no-undef */
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
import { useMemo } from 'react'

import { ACCOUNT_TAB } from '@/constants'

type UserMenuItem = {
  key: string
  label: string
  icon: React.ReactNode
  action: () => void
  className?: string
}

const NavbarUserMenu = () => {
  const translateUserPanel = useTranslations('navigation.navbar.userPanel')

  const router = useRouter()
  const pathname = usePathname()
  const user = useSession()?.data?.user

  const isAdmin = user?.role === Role.ADMIN
  const isDashboard = pathname.startsWith('/dashboard')

  const menuItems = useMemo<UserMenuItem[]>(() => {
    const items: UserMenuItem[] = [
      {
        key: 'account',
        label: 'account',
        icon: <UserIcon />,
        action: () => router.push(`/account?tab=${ACCOUNT_TAB.ACCOUNT}`),
      },
      {
        key: 'order',
        label: 'orders',
        icon: <PackageIcon />,
        action: () => router.push(`/account?tab=${ACCOUNT_TAB.ORDER}`),
      },
      {
        key: 'favorite',
        label: 'favorites',
        icon: <HeartIcon />,
        action: () => router.push(`/account?tab=${ACCOUNT_TAB.FAVORITE}`),
      },
    ]

    if (isAdmin && !isDashboard) {
      items.push({
        key: 'dashboard',
        label: 'dashboard',
        icon: <SettingsIcon />,
        action: () => router.push('/dashboard'),
      })
    }

    items.push({
      key: 'logout',
      label: 'logout',
      icon: <LogOutIcon />,
      className: 'text-danger',
      action: () => signOut({ callbackUrl: '/' }),
    })

    return items
  }, [isAdmin, isDashboard, router])

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Button isIconOnly radius='full' variant='light'>
          <UserIcon />
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label='User menu'
        onAction={(key) => {
          const item = menuItems.find((i) => i.key === key)
          item?.action()
        }}
      >
        {menuItems.map((item) => (
          <DropdownItem
            key={item.key}
            className={item.className}
            startContent={item.icon}
          >
            {translateUserPanel(item.label)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export { NavbarUserMenu }
