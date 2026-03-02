'use client'

import { Listbox, ListboxItem, ScrollShadow, Divider } from '@heroui/react'
import {
  Users,
  Settings,
  LogOut,
  MapPinIcon,
  StarIcon,
  TruckIcon,
  PackageIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  LayoutDashboardIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CustomIcon } from './CustomIcon'
import { NavbarLogo } from '../layouts/Navbar/_components/NavbarLogo'

import { useIsMounted } from '@/hooks/useIsMounted'

const AdminSidebar = () => {
  const pathname = usePathname()
  const isMounted = useIsMounted()

  const menuItems = [
    {
      href: '/dashboard',
      label: 'หน้าหลัก',
      icon: <CustomIcon icon={LayoutDashboardIcon} />,
    },
    {
      href: '/dashboard/products',
      label: 'สินค้า',
      icon: <CustomIcon icon={ShoppingBagIcon} />,
    },
    {
      href: '/dashboard/users',
      label: 'ผู้ใช้งาน',
      icon: <CustomIcon icon={Users} />,
    },
    {
      href: '/dashboard/addresses',
      label: 'ที่อยู่',
      icon: <CustomIcon icon={MapPinIcon} />,
    },
    {
      href: '/dashboard/reviews',
      label: 'รีวิว',
      icon: <CustomIcon icon={StarIcon} />,
    },
    {
      href: '/dashboard/shipping',
      label: 'ค่าจัดส่ง',
      icon: <CustomIcon icon={TruckIcon} />,
    },
    {
      href: '/dashboard/orders',
      label: 'ออเดอร์',
      icon: <CustomIcon icon={PackageIcon} />,
    },
    {
      href: '/dashboard/posts',
      label: 'โพสต์',
      icon: <CustomIcon icon={NewspaperIcon} />,
    },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <aside className='border-default-100 bg-background sticky top-0 z-40 flex h-screen w-64 flex-col border-r'>
      <div className='flex flex-col justify-center gap-2 p-5 text-center'>
        <NavbarLogo href={'/'} />
        <span>แผงควบคุมผู้ดูแลระบบ</span>
      </div>

      <Divider className='bg-default-100' />

      <ScrollShadow className='flex-1 p-4'>
        <Listbox aria-label='Admin Navigation' variant='flat'>
          {menuItems.map((item) => (
            <ListboxItem
              key={item.href}
              as={Link}
              className={`h-12 ${pathname === item.href ? 'bg-primary/10 text-primary font-semibold' : ''}`}
              href={item.href}
              startContent={item.icon}
            >
              {item.label}
            </ListboxItem>
          ))}
        </Listbox>
      </ScrollShadow>

      <Divider className='bg-default-100' />

      <div className='p-4'>
        <Listbox aria-label='Settings and Logout' variant='flat'>
          <ListboxItem
            key='settings'
            as={Link}
            className={`h-12 ${pathname === '/admin/settings' ? 'bg-default-100' : ''}`}
            href='/dashboard/settings'
            startContent={<CustomIcon icon={Settings} />}
          >
            ตั้งค่าระบบ
          </ListboxItem>
          <ListboxItem
            key='logout'
            className='text-danger h-12'
            color='danger'
            startContent={<LogOut size={20} />}
          >
            ออกจากระบบ
          </ListboxItem>
        </Listbox>
      </div>
    </aside>
  )
}

export { AdminSidebar }
