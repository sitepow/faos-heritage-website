'use client'

import { Listbox, ListboxItem, ScrollShadow, Divider } from '@heroui/react'
import {
  UsersIcon,
  LogOutIcon,
  MapPinIcon,
  StarIcon,
  TruckIcon,
  PackageIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  LayoutDashboardIcon,
  TagIcon,
  LayersIcon,
  FoldersIcon,
  ArrowUpLeft,
  Share2Icon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

import { CustomIcon } from './CustomIcon'
import { NavbarLogo } from '../layouts/Navbar/_components/NavbarLogo'

import { ThemeSwitch } from '@/app/(dashboard)/_components/ThemeSwitch'
import { useIsMounted } from '@/hooks/useIsMounted'

const AdminSidebar = () => {
  const pathname = usePathname()
  const isMounted = useIsMounted()

  const menuItems = [
    {
      href: '/dashboard',
      label: 'หน้าหลัก',
      icon: LayoutDashboardIcon,
    },
    {
      href: '/dashboard/products',
      label: 'สินค้า',
      icon: ShoppingBagIcon,
    },
    {
      href: '/dashboard/categories',
      label: 'หมวดหมู่',
      icon: LayersIcon,
    },
    {
      href: '/dashboard/tags',
      label: 'แท็ก',
      icon: TagIcon,
    },
    {
      href: '/dashboard/orders',
      label: 'ออเดอร์',
      icon: PackageIcon,
    },
    {
      href: '/dashboard/users',
      label: 'ผู้ใช้งาน',
      icon: UsersIcon,
    },
    {
      href: '/dashboard/posts',
      label: 'โพสต์',
      icon: NewspaperIcon,
    },
    {
      href: '/dashboard/blog-categories',
      label: 'หมวดหมู่บทความ',
      icon: FoldersIcon,
    },
    {
      href: '/dashboard/addresses',
      label: 'ที่อยู่',
      icon: MapPinIcon,
    },
    {
      href: '/dashboard/reviews',
      label: 'รีวิว',
      icon: StarIcon,
    },
    {
      href: '/dashboard/shipping',
      label: 'ค่าจัดส่ง',
      icon: TruckIcon,
    },
    {
      href: '/dashboard/affiliates',
      label: 'แอฟฟิลิเอต',
      icon: Share2Icon,
    },
  ]

  const handleLogout = () => signOut({ callbackUrl: '/' })

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  if (!isMounted) {
    return null
  }

  return (
    <aside className='border-default-100 bg-background sticky top-0 z-40 flex h-screen w-64 flex-col border-r'>
      <div className='flex flex-col justify-center gap-2 p-5 text-center'>
        <NavbarLogo href={'/'} />
      </div>

      <Divider className='bg-default-100' />

      <ScrollShadow className='flex-1 p-4'>
        <Listbox aria-label='Admin Navigation' variant='flat'>
          {menuItems.map((item) => {
            const active = isActive(item.href)

            return (
              <ListboxItem
                key={item.href}
                as={Link}
                className={`h-12 ${
                  active ? 'bg-primary/10 text-primary font-semibold' : ''
                }`}
                href={item.href}
                startContent={
                  <CustomIcon
                    className={active ? 'text-primary' : 'text-default-400'}
                    icon={item.icon}
                  />
                }
              >
                {item.label}
              </ListboxItem>
            )
          })}
        </Listbox>
      </ScrollShadow>

      <Divider className='bg-default-100' />

      <div className='p-4'>
        <ThemeSwitch />
        <Listbox aria-label='Settings and Logout' variant='flat'>
          <ListboxItem
            key='home'
            as={Link}
            href='/'
            startContent={
              <CustomIcon className='text-default-400' icon={ArrowUpLeft} />
            }
          >
            ไปที่หน้าร้าน
          </ListboxItem>
          <ListboxItem
            key='logout'
            className='text-danger h-12'
            color='danger'
            startContent={<CustomIcon icon={LogOutIcon} />}
            onPress={handleLogout}
          >
            ออกจากระบบ
          </ListboxItem>
        </Listbox>
      </div>
    </aside>
  )
}

export { AdminSidebar }
