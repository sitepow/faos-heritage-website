/* eslint-disable @next/next/no-img-element */
'use client'

import {
  Navbar as HeroNavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/navbar'
import { link as linkStyles } from '@heroui/theme'
import { LogInIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import type { NavItem } from '@/config/site'

import { ThemeSwitch } from '../theme-switch'
import { Cart } from './etc/cart'
import { Header } from './etc/header'
import { Panel } from './etc/panel'
import { Search } from './etc/search'

import { siteConfig } from '@/config/site'
import { cn } from '@/utils/style'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { status } = useSession()
  const pathname = usePathname()

  const isAuthenticated = status === 'authenticated'
  const isDashboard = pathname.startsWith('/dashboard')

  const menuItems = isDashboard
    ? siteConfig.adminNavbarItems
    : siteConfig.mainNavItems

  const renderLink = (item: NavItem) => {
    return (
      <Link
        className={cn(linkStyles({ color: 'foreground' }))}
        href={item.href}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <>
      {!isMenuOpen && <Header />}

      <HeroNavbar
        isBordered
        className='shadow-md'
        isBlurred={false}
        isMenuOpen={isMenuOpen}
        maxWidth='full'
        position='sticky'
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
          <Link className='shrink-0' href='/'>
            <img alt='faos-logo' height={55} src='/logo.png' width={55} />
          </Link>

          <ul className='ml-2 hidden gap-4 lg:flex'>
            {menuItems?.map((item) => (
              <NavbarItem key={item.href}>{renderLink(item)}</NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent
          className='hidden basis-1/5 sm:flex sm:basis-full'
          justify='end'
        >
          {!isDashboard && (
            <NavbarItem className='hidden xl:flex'>
              <Search />
            </NavbarItem>
          )}

          {isAuthenticated && (
            <NavbarItem className='hidden items-center gap-4 lg:flex'>
              <Panel setIsMenuOpen={setIsMenuOpen} />

              {!isDashboard && <Cart />}

              <ThemeSwitch />
            </NavbarItem>
          )}

          {!isAuthenticated && (
            <NavbarItem className='hidden items-center gap-4 lg:flex'>
              <Link href={siteConfig.link.login}>
                <LogInIcon className='text-default-500' />
              </Link>
              <ThemeSwitch />
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarMenu className='border-t border-divider bg-white dark:bg-inherit'>
          {menuItems.map((item) => (
            <NavbarMenuItem
              key={item.href}
              className='text-base'
              onClick={() => setIsMenuOpen(false)}
            >
              {renderLink(item)}
            </NavbarMenuItem>
          ))}
        </NavbarMenu>

        {isAuthenticated && (
          <NavbarItem className='flex items-center gap-3 lg:hidden'>
            <Panel setIsMenuOpen={setIsMenuOpen} />
            {!isDashboard && <Cart />}
            <ThemeSwitch />
          </NavbarItem>
        )}

        {!isAuthenticated && !isDashboard && (
          <NavbarItem className='flex items-center gap-3 lg:hidden'>
            <Link href={siteConfig.link.login}>
              <LogInIcon className='text-default-500' />
            </Link>
            <ThemeSwitch />
          </NavbarItem>
        )}

        <NavbarMenuToggle className='cursor-pointer text-default-500 lg:hidden' />
      </HeroNavbar>
    </>
  )
}

export { Navbar }
