export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'DemoStore - ร้านค้าออนไลน์',
  description: '',
  footer: 'Copyright 2025 DemoStore. ร้านค้าออนไลน์',
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
      href: '/product',
    },
    {
      label: 'วิธีการชำระเงิน',
      href: '/payment',
    },
    {
      label: 'เกี่ยวกับเรา',
      href: '/about',
    },
  ],
  adminNavbarItems: [
    {
      label: 'ภาพรวม',
      href: '/dashboard',
    },
    {
      label: 'จัดการข้อมูลลูกค้า',
      href: '/dashboard/customer',
    },
    {
      label: 'จัดการข้อมูลสินค้า',
      href: '/dashboard/product',
    },
    {
      label: 'จัดการข้อมูลออเดอร์',
      href: '/dashboard/order',
    },
  ],
}
