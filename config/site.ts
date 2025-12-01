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
      label: 'จัดการข้อมูลออเดอร์',
      href: '/dashboard/order',
    },
    {
      label: 'จัดการข้อมูลข่าวสาร',
      href: '/dashboard/article',
    },
  ] satisfies NavItem[],
}
