'use client'
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
} from '@heroui/react'
import { link as linkStyles } from '@heroui/theme'
import NextLink from 'next/link'
import { useSession } from 'next-auth/react'

import { ThemeSwitch } from '../theme-switch'
import { Panel } from './etc/panel'

import { siteConfig } from '@/config/site'
import { cn } from '@/utils/style'

const AdminNavbar = () => {
  const { status } = useSession()

  return (
    <HeroUINavbar
      isBordered
      className='shadow-md'
      maxWidth='full'
      position='sticky'
    >
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <NavbarBrand as='li' className='max-w-fit gap-3'>
          <NextLink className='flex items-center justify-start gap-2' href='/'>
            <div className='flex flex-col gap-0 text-inherit'>
              <b className='text-xl'>{siteConfig.name}</b>
              <span className='text-xs text-primary-website dark:text-white'>
                สำหรับร้านค้าออนไลน์
              </span>
            </div>
          </NextLink>
        </NavbarBrand>
        <ul className='ml-2 hidden justify-start gap-4 lg:flex'>
          {siteConfig?.adminNavbarItems?.map((item) => (
            <NavbarItem key={item?.href}>
              <NextLink
                className={cn(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:font-medium data-[active=true]:text-primary',
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
            <Panel />
          </NavbarItem>
        )}

        <NavbarItem className='hidden lg:flex'>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenuToggle className='lg:hidden' />
    </HeroUINavbar>
  )
}

export { AdminNavbar }
