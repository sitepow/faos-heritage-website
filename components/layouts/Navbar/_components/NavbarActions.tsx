import { Button } from '@heroui/react'
import { SearchIcon, LogInIcon } from 'lucide-react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { NavbarCartIndicator } from './NavbarCartIndicator'
import { NavbarUserMenu } from './NavbarUserMenu'

const NavbarActions = () => {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className='flex flex-1 items-center justify-end gap-5'>
      <div className='flex items-center gap-4'>
        <Button
          isIconOnly
          variant='light'
          className='text-default-600 lg:hidden'
        >
          <SearchIcon />
        </Button>

        {session ? (
          <NavbarUserMenu />
        ) : (
          <Button
            isIconOnly
            variant='light'
            className='text-default-600'
            onClick={() => router.push('/login')}
          >
            <LogInIcon />
          </Button>
        )}

        <div className='bg-divider h-4 w-[1px]' />

        <NavbarCartIndicator />
      </div>
    </div>
  )
}

export { NavbarActions }
