/* eslint-disable react/no-array-index-key */
'use client'

import { Listbox, ListboxItem, ScrollShadow, Button } from '@heroui/react'
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
  MenuIcon,
  StoreIcon,
  WarehouseIcon,
  FileSignatureIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState, useMemo } from 'react'

import type { ElementType } from 'react'

import { CustomIcon } from './CustomIcon'
import { NavbarLogo } from '../layouts/Navbar/_components/NavbarLogo'

import { useAuth } from '@/hooks/useAuth'
import { useIsMounted } from '@/hooks/useIsMounted'

interface SidebarItem {
  href: string
  label: string
  icon: ElementType
  adminOnly?: boolean
}

interface SidebarGroup {
  title: string
  adminOnly?: boolean
  items: SidebarItem[]
}

const AdminSidebar = () => {
  const pathname = usePathname()
  const isMounted = useIsMounted()
  const [isOpen, setIsOpen] = useState(false)

  const { isAdmin, roles, isStockManager } = useAuth()
  const isPOS = roles.includes('POS')

  const menuGroups = useMemo<SidebarGroup[]>(() => {
    const groups: SidebarGroup[] = [
      {
        title: 'แดชบอร์ด',
        items: [
          {
            href: '/dashboard',
            label: 'หน้าหลัก',
            icon: LayoutDashboardIcon,
            adminOnly: true,
          },
          {
            href: '/dashboard/contracts',
            label: 'สัญญาคู่ค้า',
            icon: FileSignatureIcon,
          },
          { href: '/dashboard/orders', label: 'ออเดอร์', icon: PackageIcon },
          {
            href: '/dashboard/affiliates',
            label: 'แอฟฟิลิเอต',
            icon: Share2Icon,
            adminOnly: true,
          },
        ],
      },
      {
        title: 'จัดการสินค้า',
        adminOnly: true,
        items: [
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
          { href: '/dashboard/tags', label: 'แท็ก', icon: TagIcon },
        ],
      },
      {
        title: 'เนื้อหา & ผู้ใช้',
        adminOnly: true,
        items: [
          { href: '/dashboard/posts', label: 'โพสต์', icon: NewspaperIcon },
          {
            href: '/dashboard/blog-categories',
            label: 'หมวดหมู่บทความ',
            icon: FoldersIcon,
          },
          { href: '/dashboard/users', label: 'ผู้ใช้งาน', icon: UsersIcon },
          { href: '/dashboard/reviews', label: 'รีวิว', icon: StarIcon },
        ],
      },
      {
        title: 'ระบบ',
        items: [
          {
            href: '/dashboard/shipping',
            label: 'ค่าจัดส่ง',
            icon: TruckIcon,
            adminOnly: true,
          },
          {
            href: '/dashboard/addresses',
            label: 'ที่อยู่',
            icon: MapPinIcon,
            adminOnly: true,
          },
          {
            href: '/dashboard/storefronts',
            label: 'หน้าร้าน',
            icon: StoreIcon,
            adminOnly: true,
          },
          {
            href: '/dashboard/inventory',
            label: 'สต็อกสินค้า',
            icon: WarehouseIcon,
          },
        ],
      },
    ]

    if (isAdmin) {
      return groups
    }

    return groups
      .map((group) => {
        const filteredItems = group.items.filter((item) => {
          if (item.adminOnly) {
            return false
          }

          if (isPOS && !isStockManager) {
            return (
              item.href === '/dashboard/orders' ||
              item.href === '/dashboard/contracts'
            )
          }

          if (
            item.href === '/dashboard/orders' ||
            item.href === '/dashboard/contracts'
          ) {
            return false
          }

          return true
        })

        return {
          ...group,
          items: filteredItems,
        }
      })
      .filter((group) => {
        return group.items.length > 0 && !group.adminOnly
      })
  }, [isAdmin, isPOS, isStockManager])

  const handleLogout = () => {
    return signOut({ callbackUrl: '/' })
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const toggleSidebar = () => {
    return setIsOpen(!isOpen)
  }

  if (!isMounted) {
    return null
  }

  const SidebarContent = (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between p-6'>
        <NavbarLogo href={'/'} />
      </div>

      <ScrollShadow className='flex-1 px-4 py-2'>
        <div className='flex flex-col gap-6'>
          {menuGroups.map((group, idx) => (
            <div key={idx} className='flex flex-col gap-2'>
              <p className='text-default-400 px-2 text-[10px] font-bold tracking-wider uppercase'>
                {group.title}
              </p>
              <Listbox aria-label={group.title} variant='flat'>
                {group.items.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <ListboxItem
                      key={item.href}
                      as={Link}
                      className={`h-10 ${
                        active
                          ? 'bg-primary/10 text-primary font-bold'
                          : 'text-default-500 hover:text-default-900'
                      }`}
                      href={item.href}
                      startContent={
                        <CustomIcon
                          className={
                            active ? 'text-primary' : 'text-default-400'
                          }
                          icon={item.icon}
                        />
                      }
                      onPress={() => {
                        return setIsOpen(false)
                      }}
                    >
                      <span className='text-sm'>{item.label}</span>
                    </ListboxItem>
                  )
                })}
              </Listbox>
            </div>
          ))}
        </div>
      </ScrollShadow>

      <div className='bg-default-50/50 flex flex-col gap-2 p-4'>
        <Listbox aria-label='Account Settings' variant='flat'>
          <ListboxItem
            key='home'
            as={Link}
            className='text-default-500 h-10'
            href='/'
            startContent={
              <CustomIcon className='text-default-400' icon={ArrowUpLeft} />
            }
          >
            <span className='text-sm'>ไปที่หน้าร้าน</span>
          </ListboxItem>
          <ListboxItem
            key='logout'
            className='text-danger h-10'
            color='danger'
            startContent={<CustomIcon icon={LogOutIcon} />}
            onPress={handleLogout}
          >
            <span className='text-sm'>ออกจากระบบ</span>
          </ListboxItem>
        </Listbox>
      </div>
    </div>
  )

  return (
    <>
      <div className='bg-background border-default-100 sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3 lg:hidden'>
        <NavbarLogo href={'/'} />
        <Button isIconOnly variant='light' onPress={toggleSidebar}>
          <MenuIcon size={24} />
        </Button>
      </div>

      <aside className='border-default-100 bg-background sticky top-0 hidden h-screen w-64 shrink-0 border-r lg:flex lg:flex-col'>
        {SidebarContent}
      </aside>

      {isOpen && (
        <div className='fixed inset-0 z-[60] flex lg:hidden'>
          <div
            className='absolute inset-0 bg-black/50'
            onClick={toggleSidebar}
          />
          <aside className='bg-background animate-in slide-in-from-left border-default-100 relative h-screen w-[280px] border-r shadow-2xl duration-300'>
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

export { AdminSidebar }
