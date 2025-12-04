'use client'

import { Button } from '@heroui/button'
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar'
import { link as linkStyles } from '@heroui/theme'
import { UserIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ThemeSwitch } from '../theme-switch'
import { Cart } from './etc/cart'
import { Header } from './etc/header'
import { Panel } from './etc/panel'
import { Search } from './etc/search'

import type { NavItem } from '@/config/site'
import { siteConfig } from '@/config/site'
import { cn } from '@/utils/style'
import { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { status } = useSession()
  const pathname = usePathname()

  const isAuthenticated = status === 'authenticated'
  const isDashboard = pathname.startsWith('/dashboard')

  const menuItems = isDashboard ? siteConfig.adminNavbarItems : siteConfig.mainNavItems

  const renderLink = (item: NavItem) => (
    <Link
      href={item.href}
      className={cn(
        linkStyles({ color: 'foreground' }),
        'data-[active=true]:font-medium data-[active=true]:text-primary',
      )}
    >
      {item.label}
    </Link>
  )

  return (
    <>
      <Header />

      <HeroNavbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        isBordered
        className='shadow-md'
        maxWidth='full'
        position='sticky'
      >
        <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
          <NavbarBrand as='li' className='max-w-fit gap-3 dark:text-white'>
            <Link className='flex items-center gap-2' href='/'>
              <div className='flex flex-col text-primary-website'>
                <b className='text-xl'>{siteConfig.name}</b>
                <span className='text-xs'>สำหรับร้านค้าออนไลน์</span>
              </div>
            </Link>
          </NavbarBrand>

          <ul className='ml-2 hidden gap-4 lg:flex'>
            {menuItems?.map((item) => (
              <NavbarItem key={item.href}>{renderLink(item)}</NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent className='hidden basis-1/5 sm:flex sm:basis-full' justify='end'>
          {!isDashboard && (
            <NavbarItem className='hidden lg:flex'>
              <Search />
            </NavbarItem>
          )}

          {!isAuthenticated ? (
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
          ) : (
            <NavbarItem className='hidden lg:flex'>
              <Panel setIsMenuOpen={setIsMenuOpen} />
            </NavbarItem>
          )}

          {isAuthenticated && !isDashboard && (
            <NavbarItem className='hidden lg:flex'>
              <Cart />
            </NavbarItem>
          )}

          <NavbarItem className='hidden lg:flex'>
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu className='pt-18 sm:pt-12'>
          {menuItems.map((item) => (
            <NavbarMenuItem onClick={() => setIsMenuOpen(false)} key={item.href}>
              {renderLink(item)}
            </NavbarMenuItem>
          ))}

          {isAuthenticated ? (
            <NavbarItem>
              <div className='flex items-center justify-between border-y border-divider py-2.5'>
                <Panel setIsMenuOpen={setIsMenuOpen} />
                <ThemeSwitch />
              </div>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <div className='flex justify-between border-y border-divider py-2.5'>
                <Button
                  as={Link}
                  href={siteConfig.link.login}
                  startContent={<UserIcon />}
                  variant='light'
                >
                  เข้าสู่ระบบ/สมัครสมาชิก
                </Button>

                <ThemeSwitch />
              </div>
            </NavbarItem>
          )}
        </NavbarMenu>

        {isAuthenticated && (
          <NavbarItem className='lg:hidden'>
            <Cart />
          </NavbarItem>
        )}

        <NavbarMenuToggle className='cursor-pointer lg:hidden' />
      </HeroNavbar>
    </>
  )
}

export { Navbar }
