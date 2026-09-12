'use client'

import { Heart, LayoutDashboard, LogOut, Package, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useMemo, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'

type UserMenuItem = {
  key: string
  label: string
  icon: ReactNode
  action: () => void
}

const NavbarUserMenu = () => {
  const router = useRouter()
  const t = useTranslations('navigation.navbar.userPanel')
  const pathname = usePathname()
  const { data: session } = useSession()

  const { canManageStock, isPOS, isAdmin } = useAuth()
  const isDashboard = pathname.startsWith('/dashboard')
  const navigation = useAppNavigation()

  const menuItems = useMemo<UserMenuItem[]>(() => {
    const items: UserMenuItem[] = [
      {
        key: 'account',
        label: 'account',
        icon: <User className='mr-2.5 h-4 w-4 text-neutral-500' />,
        action: navigation.ACCOUNT,
      },
      {
        key: 'order',
        label: 'orders',
        icon: <Package className='mr-2.5 h-4 w-4 text-neutral-500' />,
        action: navigation.ORDER,
      },
      {
        key: 'favorite',
        label: 'favorites',
        icon: <Heart className='mr-2.5 h-4 w-4 text-neutral-500' />,
        action: navigation.FAVORITE,
      },
    ]

    if ((canManageStock || isPOS) && !isDashboard) {
      items.push({
        key: 'dashboard',
        label: 'dashboard',
        icon: <LayoutDashboard className='mr-2.5 h-4 w-4 text-neutral-500' />,
        action: () => {
          if (isPOS && !isAdmin && !canManageStock) {
            return router.push('/dashboard/orders')
          }
          return router.push('/dashboard/inventory')
        },
      })
    }

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label='User profile'
          className='h-9 w-9 rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#f59e0b]'
          size='icon'
          variant='ghost'
        >
          <User className='h-[18px] w-[18px]' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-52 py-1.5 shadow-xl'>
        {session?.user && (
          <div className='border-b border-neutral-100 px-3 py-2 dark:border-neutral-800'>
            <p className='truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100'>
              {session.user.name || session.user.email}
            </p>
            {session.user.name && session.user.email && (
              <p className='truncate text-[11px] text-neutral-400 dark:text-neutral-500'>
                {session.user.email}
              </p>
            )}
          </div>
        )}

        <div className='py-1'>
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.key}
              className='flex items-center px-3 py-2 text-xs text-neutral-700 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:text-[#f59e0b]'
              onClick={item.action}
            >
              {item.icon}
              <span>{t(item.label)}</span>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className='flex items-center px-3 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40'
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className='mr-2.5 h-4 w-4 text-red-500' />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { NavbarUserMenu }
