/* eslint-disable no-undef */
'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
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
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'

type UserMenuItem = {
  key: string
  label: string
  icon: React.ReactNode
  action: () => void
  className?: string
}

const NavbarUserMenu = () => {
  const router = useRouter()
  const t = useTranslations('navigation.navbar.userPanel')
  const pathname = usePathname()

  const { canManageStock, isPOS, isAdmin } = useAuth()

  const isDashboard = pathname.startsWith('/dashboard')
  const navigation = useAppNavigation()

  const menuItems = useMemo<UserMenuItem[]>(() => {
    const items: UserMenuItem[] = [
      {
        key: 'account',
        label: 'account',
        icon: <CustomIcon icon={UserIcon} />,
        action: navigation.ACCOUNT,
      },
      {
        key: 'order',
        label: 'orders',
        icon: <CustomIcon icon={PackageIcon} />,
        action: navigation.ORDER,
      },
      {
        key: 'favorite',
        label: 'favorites',
        icon: <CustomIcon icon={HeartIcon} />,
        action: navigation.FAVORITE,
      },
    ]

    if ((canManageStock || isPOS) && !isDashboard) {
      items.push({
        key: 'dashboard',
        label: 'dashboard',
        icon: <CustomIcon icon={SettingsIcon} />,
        action: () => {
          if (isPOS && !isAdmin && !canManageStock) {
            return router.push('/dashboard/orders')
          }
          return router.push('/dashboard/inventory')
        },
      })
    }

    items.push({
      key: 'logout',
      label: 'logout',
      icon: <CustomIcon icon={LogOutIcon} />,
      action: () => {
        return signOut({ callbackUrl: '/' })
      },
    })

    return items
  }, [
    canManageStock,
    isPOS,
    isAdmin,
    isDashboard,
    navigation.ACCOUNT,
    navigation.FAVORITE,
    navigation.ORDER,
    router,
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
          const item = menuItems.find((i) => {
            return i.key === key
          })
          item?.action()
        }}
      >
        {menuItems.map((item) => (
          <DropdownItem
            key={item.key}
            className={item.className}
            startContent={item.icon}
          >
            {t(item.label)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export { NavbarUserMenu }
