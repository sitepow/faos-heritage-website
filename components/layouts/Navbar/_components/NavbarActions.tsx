'use client'

import { Button } from '@heroui/react'
import { LogInIcon } from 'lucide-react'

import { NavbarCartIndicator } from './NavbarCartIndicator'
import { NavbarUserMenu } from './NavbarUserMenu'

import { CustomIcon } from '@/components/ui/CustomIcon'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'

const NavbarActions = () => {
  const { isAuthenticated } = useAuth()
  const navigation = useAppNavigation()

  return (
    <div className='flex flex-wrap items-center gap-4'>
      {isAuthenticated ? (
        <NavbarUserMenu />
      ) : (
        <Button isIconOnly variant='light' onPress={navigation.LOGIN}>
          <CustomIcon icon={LogInIcon} />
        </Button>
      )}

      <div className='bg-divider h-4 w-[1px]' />
      <NavbarCartIndicator />
    </div>
  )
}

export { NavbarActions }
