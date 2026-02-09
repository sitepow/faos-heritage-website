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
import { signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { CustomIcon } from '@/components/ui/CustomIcon'
import { PROFILE_TABS } from '@/constants'
import { useAuth } from '@/hooks/useAuth'

type UserMenuItem = {
  key: string
  label: string
  icon: React.ReactNode
  action: () => void
  className?: string
}

const NavbarUserMenu = () => {
  const translateUserPanel = useTranslations('navigation.navbar.userPanel')

  const pathname = usePathname()
  const { user } = useAuth()

  const isAdmin = user?.role === Role.ADMIN
  const isDashboard = pathname.startsWith('/dashboard')

  const router = useRouter()
  const ROUTER_PATHS = {
    ACCOUNT: () => router.push(`/profile?tab=${PROFILE_TABS.ACCOUNT}`),
    ORDER: () => router.push(`/profile?tab=${PROFILE_TABS.ORDER}`),
    FAVORITE: () => router.push(`/profile?tab=${PROFILE_TABS.FAVORITE}`),
    DASHBOARD: () => router.push('/dashboard'),
  }

  const menuItems = useMemo<UserMenuItem[]>(() => {
    const items: UserMenuItem[] = [
      {
        key: 'account',
        label: 'account',
        icon: <CustomIcon icon={UserIcon} />,
        action: ROUTER_PATHS.ACCOUNT,
      },
      {
        key: 'order',
        label: 'orders',
        icon: <CustomIcon icon={PackageIcon} />,
        action: ROUTER_PATHS.ORDER,
      },
      {
        key: 'favorite',
        label: 'favorites',
        icon: <CustomIcon icon={HeartIcon} />,
        action: ROUTER_PATHS.FAVORITE,
      },
    ]

    if (isAdmin && !isDashboard) {
      items.push({
        key: 'dashboard',
        label: 'dashboard',
        icon: <CustomIcon icon={SettingsIcon} />,
        action: ROUTER_PATHS.DASHBOARD,
      })
    }

    items.push({
      key: 'logout',
      label: 'logout',
      icon: <CustomIcon icon={LogOutIcon} />,
      action: () => signOut({ callbackUrl: '/' }),
    })

    return items
  }, [
    ROUTER_PATHS.ACCOUNT,
    ROUTER_PATHS.DASHBOARD,
    ROUTER_PATHS.FAVORITE,
    ROUTER_PATHS.ORDER,
    isAdmin,
    isDashboard,
  ])

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Button isIconOnly radius='full' variant='light'>
          <CustomIcon icon={UserIcon} />
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
