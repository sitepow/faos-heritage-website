'use client'

import {
  Button,
  Navbar as HeroUINavbar,
  Input,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/react'
import { link as linkStyles } from '@heroui/theme'
import {
  SearchIcon,
  ShoppingCartIcon,
  TriangleIcon,
  UserIcon,
} from 'lucide-react'
import { default as Link, default as NextLink } from 'next/link'
import { useSession } from 'next-auth/react'

import { ThemeSwitch } from '../theme-switch'
import { ControlPanel } from './control-panel'

import { siteConfig } from '@/config/site'
import { cn } from '@/utils/style'

const MainNavbar = () => {
  const { status } = useSession()

  const searchInput = (
    <Input
      aria-label='Search'
      classNames={{
        inputWrapper: 'bg-default-100 ',
        input: 'text-sm',
      }}
      endContent={
        <SearchIcon className='pointer-events-none flex-shrink-0 text-base text-default-400' />
      }
      labelPlacement='outside'
      placeholder='ค้นหาสิ่งที่ต้องการที่นี่...'
      type='search'
    />
  )

  return (
    <>
      <div className='items-center bg-primary-website px-6 py-2.5 text-xs text-white sm:text-sm lg:text-base'>
        เปิดร้านออนไลน์ได้ในไม่กี่นาที ไม่ต้องเขียนโค้ด ปลอดภัยทุกการชำระเงิน
      </div>

      <HeroUINavbar
        isBordered
        className='shadow-md'
        isBlurred={false}
        maxWidth='full'
        position='sticky'
      >
        <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
          <NavbarBrand
            as='li'
            className='max-w-fit gap-3 text-primary-website dark:text-white'
          >
            <NextLink
              className='flex items-center justify-start gap-2'
              href='/'
            >
              <TriangleIcon />
              <div className='flex flex-col gap-0 text-inherit'>
                <b className='text-xl'>{siteConfig.name}</b>
                <span className='text-xs'>สำหรับร้านค้าออนไลน์</span>
              </div>
            </NextLink>
          </NavbarBrand>
          <ul className='ml-2 hidden justify-start gap-4 lg:flex'>
            {siteConfig?.mainNavItems?.map((item) => (
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
              <ControlPanel />
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
          <NavbarItem className='hidden lg:flex'>
            <ThemeSwitch />
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>
    </>
  )
}

export { MainNavbar }
