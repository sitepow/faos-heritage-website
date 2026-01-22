/* eslint-disable @next/next/no-img-element */
import { Badge, Button, Input } from '@heroui/react'
import { LogInIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { NavbarHeader } from './header'
import { NavbarPanel } from './panel'

export const Navbar = () => {
  const t = useTranslations('Navbar')
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <nav className='sticky top-0 z-50 flex w-full flex-col bg-[#f1f1f1ec] backdrop-blur-md dark:bg-[#131314ec]'>
      <NavbarHeader />

      <div className='border-divider w-full border-b'>
        <div className='container mx-auto flex items-center justify-between gap-4 px-5 py-2.5 md:gap-8'>
          <div className='flex gap-5'>
            <img
              src='/images/logo.png'
              alt='Logo'
              className='size-[55px] shrink-0 cursor-pointer rounded-md object-contain md:size-[75px]'
              onClick={() => {
                router.push('/')
              }}
            />
          </div>

          <div className='flex items-center gap-3'>
            <Input
              size='lg'
              classNames={{
                input: ['!text-primary placeholder:!text-primary'],
                inputWrapper: [
                  '!border-primary',
                  'group-data-[focus=true]:!border-primary',
                  'after:hidden',
                ],
              }}
              className='hidden w-lg lg:block'
              variant='bordered'
              placeholder={t('search')}
              endContent={<SearchIcon className='text-primary' />}
            />

            {session && <NavbarPanel />}
            {!session && (
              <Button
                isIconOnly
                variant='light'
                onClick={() => {
                  router.push('/login')
                }}
              >
                <LogInIcon />
              </Button>
            )}
            <Badge
              color='primary'
              content={'99+'}
              className='text-secondary'
              shape='circle'
            >
              <Button
                isIconOnly
                variant='light'
                onClick={() => {
                  router.push('/cart')
                }}
              >
                <ShoppingCartIcon />
              </Button>
            </Badge>

            <Button isIconOnly variant='light' className='lg:hidden'>
              <SearchIcon />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
