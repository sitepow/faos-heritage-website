import { ACCOUNT_TABS } from '@/utils/const'

export type SiteConfig = typeof siteConfig

export interface NavItem {
  label: string
  href: string
}

export const siteConfig = {
  name: 'ZentraCore',
  title: 'สร้างร้านค้าออนไลน์ของคุณ',
  description: '',
  link: {
    login: '/login',
    cart: '/cart',
  },
  mainNavItems: [
    {
      label: 'หน้าหลัก',
      href: '/',
    },
    {
      label: 'สินค้าทั้งหมด',
      href: '/products',
    },
    {
      label: 'วิธีการชำระเงิน',
      href: '/payment',
    },
    {
      label: 'คำสั่งซื้อของฉัน',
      href: `/account?tab=${ACCOUNT_TABS?.ORDER}`,
    },
    {
      label: 'เกี่ยวกับเรา',
      href: '/about',
    },
  ] satisfies NavItem[],
  adminNavbarItems: [
    {
      label: 'ภาพรวม',
      href: '/dashboard',
    },
    {
      label: 'จัดการข้อมูลผู้ใช้งาน',
      href: '/dashboard/user',
    },
    {
      label: 'จัดการข้อมูลสินค้า',
      href: '/dashboard/product',
    },
    {
      label: 'จัดการข้อมูลคำสั่งซื้อ',
      href: '/dashboard/order',
    },
  ] satisfies NavItem[],
}
