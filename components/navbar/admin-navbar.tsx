'use client'
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@heroui/react'
import { link as linkStyles } from '@heroui/theme'
import clsx from 'clsx'
import { TriangleIcon } from 'lucide-react'
import NextLink from 'next/link'
import { useSession } from 'next-auth/react'

import { UserControlPanel } from './user-control-panel'

import { siteConfig } from '@/config/site'

const AdminNavbar = () => {
  const { status } = useSession()

  return (
    <HeroUINavbar
      isBordered
      className='shadow-md'
      isBlurred={false}
      maxWidth='full'
      position='sticky'
    >
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='max-w-fit gap-3'>
          <NextLink className='flex items-center justify-start gap-2' href='/'>
            <TriangleIcon className='text-red-800' />
            <div className='flex flex-col gap-0 text-inherit'>
              <span className='font-bold'>DemoStore</span>
              <span className='text-xs text-red-800'>
                ร้านค้าตัวอย่าง (จัดการข้อมูลหลังร้าน)
              </span>
            </div>
          </NextLink>
        </NavbarBrand>
        <ul className='ml-2 hidden justify-start gap-4 lg:flex'>
          {siteConfig?.adminNavbarItems?.map((item) => (
            <NavbarItem key={item?.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                )}
                color='foreground'
                href={item?.href}
              >
                {item?.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className='hidden basis-1/5 sm:flex sm:basis-full'
        justify='end'
      >
        {status === 'authenticated' && (
          <NavbarItem className='hidden lg:flex'>
            <UserControlPanel />
          </NavbarItem>
        )}
      </NavbarContent>
    </HeroUINavbar>
  )
}

export { AdminNavbar }
