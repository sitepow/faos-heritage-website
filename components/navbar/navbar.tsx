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
import { Country } from './country'
import { NavbarHeader } from './header'
import { NavbarPanel } from './panel'
import { ThemeSwitch } from '../theme-switch'

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

  const renderLink = (item: NavItem) => (
    <Link
      className={cn(linkStyles({ color: 'foreground' }), 'font-medium')}
      href={item.href}
    >
      {t(item.label)}
    </Link>
  )

  return (
    <>
      {!isMenuOpen && <NavbarHeader />}

      <HeroNavbar
        className='light:bg-white dark:bg-inherit'
        isBlurred={false}
        isMenuOpen={isMenuOpen}
        maxWidth='full'
        position='sticky'
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
          <Link className='shrink-0' href='/'>
            <img
              alt='faos-logo'
              height={45}
              src='/images/logo.png'
              width={45}
            />
          </Link>

          <ul className='ml-4 hidden gap-4 lg:flex'>
            {menuItems?.map((item) => (
              <NavbarItem key={item.href}>{renderLink(item)}</NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent justify='end' className='gap-2 sm:gap-4'>
          <NavbarItem>
            <Country />
          </NavbarItem>

          <NavbarItem className='flex items-center'>
            <ThemeSwitch />
          </NavbarItem>

          {isAuthenticated ? (
            <>
              {!isDashboard && (
                <NavbarItem className='flex items-center'>
                  <NavbarCart />
                </NavbarItem>
              )}
              <NavbarItem className='flex items-center'>
                <NavbarPanel setIsMenuOpen={setIsMenuOpen} />
              </NavbarItem>
            </>
          ) : (
            <NavbarItem className='flex items-center'>
              <Link href={siteConfig.link.login} className='p-2'>
                <LogInIcon size={22} />
              </Link>
            </NavbarItem>
          )}

          <NavbarMenuToggle className='ml-2 cursor-pointer lg:hidden' />
        </NavbarContent>

        <NavbarMenu>
          <div className='mt-4 flex flex-col gap-4'>
            {menuItems.map((item) => (
              <NavbarMenuItem
                key={item.href}
                className='text-lg'
                onClick={() => setIsMenuOpen(false)}
              >
                {renderLink(item)}
              </NavbarMenuItem>
            ))}
          </div>
        </NavbarMenu>
      </HeroNavbar>
    </>
  )
}
