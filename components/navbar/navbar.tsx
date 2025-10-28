'use client'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from '@heroui/navbar'
// import { link as linkStyles } from '@heroui/theme'
// import clsx from 'clsx'
import {
  SearchIcon,
  ShoppingCartIcon,
  TriangleIcon,
  UserIcon,
} from 'lucide-react'
import NextLink from 'next/link'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { UserControlPanel } from './user-control-panel'

import { siteConfig } from '@/config/site'

export const Navbar = () => {
  const { status } = useSession()

  const searchInput = (
    <Input
      aria-label='Search'
      classNames={{
        inputWrapper: 'bg-default-100 ',
        input: 'text-sm',
      }}
      endContent={
        <SearchIcon className='text-default-400 pointer-events-none flex-shrink-0 text-base' />
      }
      labelPlacement='outside'
      placeholder='ค้นหาสิ่งที่ต้องการที่นี่...'
      type='search'
    />
  )

  return (
    <>
      <div className='items-center bg-red-800 px-6 py-2.5 text-xs text-white sm:text-sm lg:text-base'>
        ร้านค้าออนไลน์ ร้านค้าตัวอย่าง ศูนย์รวมสินค้าบ้านของคนไทย ครบเรื่องบ้าน
        ถูกและดี
      </div>

      <HeroUINavbar
        isBordered
        className='shadow-md'
        isBlurred={false}
        maxWidth='full'
        position='sticky'
      >
        <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
          <NavbarBrand as='li' className='max-w-fit gap-3'>
            <NextLink
              className='flex items-center justify-start gap-2'
              href='/'
            >
              <TriangleIcon className='text-red-800' />
              <div className='flex flex-col gap-0 text-inherit'>
                <span className='font-bold'>DemoStore</span>
                <span className='text-xs text-red-800'>ร้านค้าตัวอย่าง</span>
              </div>
            </NextLink>
          </NavbarBrand>
          <ul className='ml-2 hidden justify-start gap-4 lg:flex'>
            {/* {siteConfig?.navItems?.map((item) => (
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
            ))} */}
          </ul>
        </NavbarContent>

        <NavbarContent
          className='hidden basis-1/5 sm:flex sm:basis-full'
          justify='end'
        >
          <NavbarItem className='hidden lg:flex'>{searchInput}</NavbarItem>
          {status === 'unauthenticated' && (
            <NavbarItem className='hidden lg:flex'>
              <Link href={siteConfig.link.login}>
                <Button startContent={<UserIcon />} variant='light'>
                  เข้าสู่ระบบ
                </Button>
              </Link>
            </NavbarItem>
          )}
          {status === 'authenticated' && (
            <NavbarItem className='hidden lg:flex'>
              <UserControlPanel />
            </NavbarItem>
          )}
          <NavbarItem className='hidden lg:flex'>
            <Link href={siteConfig.link.cart}>
              <Button
                endContent={
                  <div className='flex size-7 items-center justify-center rounded-full bg-red-800 text-xs font-bold text-white'>
                    <span>99+</span>
                  </div>
                }
                startContent={<ShoppingCartIcon />}
                variant='light'
              />
            </Link>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>
    </>
  )
}
