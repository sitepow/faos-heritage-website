'use client'

import { Button } from '@heroui/react'
import { SearchIcon, LogInIcon } from 'lucide-react'

import { NavbarCartIndicator } from './NavbarCartIndicator'
import { NavbarMobileMenu } from './NavbarMobileMenu'
import { NavbarUserMenu } from './NavbarUserMenu'

import { CustomIcon } from '@/components/ui/CustomIcon'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'

const NavbarActions = () => {
  const { isAuthenticated } = useAuth()
  const navigation = useAppNavigation()

  return (
    <div className='flex flex-1 items-center justify-end gap-5'>
      <div className='flex flex-wrap items-center gap-4'>
        <Button isIconOnly className='lg:hidden' variant='light'>
          <CustomIcon icon={SearchIcon} />
        </Button>
        {isAuthenticated ? (
          <NavbarUserMenu />
        ) : (
          <Button isIconOnly variant='light' onPress={navigation.LOGIN}>
            <CustomIcon icon={LogInIcon} />
          </Button>
        )}
        <NavbarMobileMenu />
        <div className='bg-divider h-4 w-[1px]' />
        <NavbarCartIndicator />
      </div>
    </div>
  )
}

export { NavbarActions }
