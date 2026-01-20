/* eslint-disable @next/next/no-img-element */
import { Badge, Button, Input } from '@heroui/react'
import { MenuIcon, SearchIcon, ShoppingCartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { NavbarHeader } from './header'
import { NavbarPanel } from './panel'

import { siteConfig } from '@/config/site'

export const Navbar = () => {
  const router = useRouter()
  const translateNavbar = useTranslations('Navbar.Menu')

  return (
    <nav className='sticky top-0 z-50 flex w-full flex-col bg-white shadow dark:bg-black'>
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

            <div className='hidden w-full flex-wrap items-center justify-center gap-5 md:flex'>
              {siteConfig.mainNavItems?.map((item) => (
                <span
                  className='hover:text-primary decoration-primary cursor-pointer'
                  onClick={() => {
                    router.push(item?.href)
                  }}
                >
                  {translateNavbar(item?.label)}
                </span>
              ))}
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Input
              size='lg'
              radius='sm'
              classNames={{
                input: ['!text-primary placeholder:!text-primary'],
                inputWrapper: [
                  '!border-primary',
                  'group-data-[focus=true]:!border-primary',
                  'after:hidden',
                ],
              }}
              className='hidden max-w-96 min-w-72 lg:block'
              variant='bordered'
              placeholder='ค้นหาชื่อสินค้าหรือหมวดหมู่สินค้า'
              startContent={<SearchIcon className='text-primary' />}
            />

            <NavbarPanel />

            <Badge
              color='primary'
              className='text-secondary'
              content='2'
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

            <Button isIconOnly variant='light' className='md:hidden'>
              <MenuIcon />
            </Button>

            <Button isIconOnly variant='light' className='lg:hidden'>
              <SearchIcon />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
