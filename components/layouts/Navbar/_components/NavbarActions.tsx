'use client'

import { LogIn } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { NavbarCartIndicator } from './NavbarCartIndicator'
import { NavbarUserMenu } from './NavbarUserMenu'

import { Button } from '@/components/ui/button'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils'

interface NavbarActionsProps {
  className?: string
  showCart?: boolean
}

const NavbarActions = ({ className, showCart = true }: NavbarActionsProps) => {
  const { isAuthenticated } = useAuth()
  const navigation = useAppNavigation()
  const tAuth = useTranslations('auth.tabs')

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {isAuthenticated ? (
        <NavbarUserMenu />
      ) : (
        <Button
          aria-label={tAuth('login')}
          className='h-8 gap-1.5 rounded-full px-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#f59e0b]'
          size='sm'
          title={tAuth('login')}
          variant='ghost'
          onClick={navigation.LOGIN}
        >
          <LogIn className='h-4 w-4' />
          <span className='hidden sm:inline'>{tAuth('login')}</span>
        </Button>
      )}

      {showCart && (
        <>
          <div className='h-4 w-px bg-neutral-200 dark:bg-neutral-800' />
          <NavbarCartIndicator />
        </>
      )}
    </div>
  )
}

export { NavbarActions }
