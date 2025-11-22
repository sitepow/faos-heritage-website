'use client'

import {
  Button,
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react'
import { link as linkStyles } from '@heroui/theme'
import { UserIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { ThemeSwitch } from '../theme-switch'
import { Cart } from './etc/cart'
import { Header } from './etc/header'
import { Panel } from './etc/panel'
import { Search } from './etc/search'

import { siteConfig } from '@/config/site'
import { cn } from '@/utils/style'

const Navbar = () => {
  const { status } = useSession()
  const pathname = usePathname()
  const isDashboard = pathname === '/dashboard'
  const isAuthenticated = status === 'authenticated'

  return (
    <>
      <Header />
      <HeroNavbar
        isBordered
        className='shadow-md'
        maxWidth='full'
        position='sticky'
      >
        <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
          <NavbarBrand as='li' className='max-w-fit gap-3 dark:text-white'>
            <Link className='flex items-center justify-start gap-2' href='/'>
              <div className='flex flex-col gap-0 text-primary-website'>
                <b className='text-xl'>{siteConfig.name}</b>
                <span className='text-xs'>สำหรับร้านค้าออนไลน์</span>
              </div>
            </Link>
          </NavbarBrand>

          <ul className='ml-2 hidden justify-start gap-4 lg:flex'>
            {(isDashboard
              ? siteConfig?.adminNavbarItems
              : siteConfig?.mainNavItems
            )?.map((item) => (
              <NavbarItem key={item?.href}>
                <Link
                  className={cn(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:font-medium data-[active=true]:text-primary',
                  )}
                  color='foreground'
                  href={item?.href}
                >
                  {item?.label}
                </Link>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent
          className='hidden basis-1/5 sm:flex sm:basis-full'
          justify='end'
        >
          {!isDashboard && (
            <NavbarItem className='hidden lg:flex'>
              <Search />
            </NavbarItem>
          )}
          {!isAuthenticated && (
            <NavbarItem className='hidden lg:flex'>
              <Button
                as={Link}
                href={siteConfig.link.login}
                startContent={<UserIcon />}
                variant='light'
              >
                เข้าสู่ระบบ/สมัครสมาชิก
              </Button>
            </NavbarItem>
          )}
          {isAuthenticated && (
            <NavbarItem className='hidden lg:flex'>
              <Panel />
            </NavbarItem>
          )}
          {isAuthenticated && !isDashboard && (
            <NavbarItem className='hidden lg:flex'>
              <Cart count={18} />
            </NavbarItem>
          )}
          <NavbarItem className='hidden lg:flex'>
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu className='pt-18 sm:pt-12'>
          {siteConfig?.mainNavItems?.map((item) => (
            <NavbarMenuItem key={item?.href}>
              <Link
                className={cn(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:font-medium data-[active=true]:text-primary',
                )}
                color='foreground'
                href={item?.href}
              >
                {item?.label}
              </Link>
            </NavbarMenuItem>
          ))}

          {isAuthenticated && (
            <NavbarItem>
              <div className='flex items-center justify-between border-y border-divider py-2.5'>
                <Panel />
                <ThemeSwitch />
              </div>
            </NavbarItem>
          )}

          {!isAuthenticated && (
            <NavbarItem>
              <Button
                as={Link}
                href={siteConfig.link.login}
                startContent={<UserIcon />}
                variant='light'
              >
                เข้าสู่ระบบ/สมัครสมาชิก
              </Button>
            </NavbarItem>
          )}
        </NavbarMenu>

        {isAuthenticated && (
          <NavbarItem className='lg:hidden'>
            <Cart count={18} />
          </NavbarItem>
        )}

        <NavbarMenuToggle className='lg:hidden' />
      </HeroNavbar>
    </>
  )
}

export { Navbar }
