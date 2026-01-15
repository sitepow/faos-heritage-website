/* eslint-disable @next/next/no-img-element */
'use client'

import {
  link as linkStyles,
  Navbar as HeroNavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@heroui/react'
import { LogInIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

import type { NavItem } from '@/config/site'

import { NavbarCart } from './cart'
import { NavbarHeader } from './header'
import { NavbarPanel } from './panel'
// import { ThemeSwitch } from '../theme-switch'

import { siteConfig } from '@/config/site'
import { cn } from '@/utils/style'

export const Navbar = () => {
  const t = useTranslations('Navbar.Menu')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { status } = useSession()
  const pathname = usePathname()
  const locale = useLocale()

  const pathnameWithoutLocale =
    pathname === `/${locale}` ? '/' : pathname.replace(`/${locale}`, '')

  const isAuthenticated = status === 'authenticated'
  const isDashboard = pathnameWithoutLocale.startsWith('/dashboard')

  const menuItems = isDashboard
    ? siteConfig.adminNavbarItems
    : siteConfig.mainNavItems

  const renderLink = (item: NavItem) => {
    return (
      <Link
        className={cn(linkStyles({ color: 'foreground' }))}
        href={item.href}
      >
        {t(item.label)}
      </Link>
    )
  }

  return (
    <>
      {!isMenuOpen && <NavbarHeader />}

      <HeroNavbar
        // isBordered
        // className='shadow-md'
        isMenuOpen={isMenuOpen}
        maxWidth='full'
        position='sticky'
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
          <Link className='shrink-0' href='/'>
            <img
              alt='faos-logo'
              height={55}
              src='/images/logo.png'
              width={55}
            />
          </Link>

          <ul className='ml-2 hidden gap-4 sm:flex'>
            {menuItems?.map((item) => (
              <NavbarItem key={item.href}>{renderLink(item)}</NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent
          className='hidden basis-1/5 sm:flex sm:basis-full'
          justify='end'
        >
          {isAuthenticated && (
            <NavbarItem className='hidden items-center gap-4 lg:flex'>
              {!isDashboard && <NavbarCart />}

              {/* <ThemeSwitch /> */}
              <NavbarPanel setIsMenuOpen={setIsMenuOpen} />
            </NavbarItem>
          )}

          {!isAuthenticated && (
            <NavbarItem className='hidden items-center gap-4 lg:flex'>
              <Link href={siteConfig.link.login}>
                <LogInIcon />
              </Link>
              {/* <ThemeSwitch /> */}
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarMenu>
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
            <NavbarPanel setIsMenuOpen={setIsMenuOpen} />
            {!isDashboard && <NavbarCart />}
            {/* <ThemeSwitch /> */}
          </NavbarItem>
        )}

        {!isAuthenticated && !isDashboard && (
          <NavbarItem className='flex items-center gap-3 lg:hidden'>
            <Link href={siteConfig.link.login}>
              <LogInIcon />
            </Link>
            {/* <ThemeSwitch /> */}
          </NavbarItem>
        )}

        <NavbarMenuToggle className='cursor-pointer sm:hidden' />
      </HeroNavbar>
    </>
  )
}
