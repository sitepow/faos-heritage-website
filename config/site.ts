import { ACCOUNT_TAB } from '@/utils/const'

type SiteConfig = typeof siteConfig

interface NavItem {
  label: string
  href: string
}

const siteConfig = {
  name: 'FAOS',
  title: 'Premium Organic Olive Oil & Honey — 100% Pure Natural Collection',
  description: '',
  link: {
    login: '/login',
    cart: '/cart',
  },
  mainNavItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'All Products',
      href: '/products',
    },
    {
      label: 'Payment Methods',
      href: '/payment',
    },
    {
      label: 'My Orders',
      href: `/account?tab=${ACCOUNT_TAB?.ORDER}`,
    },
    {
      label: 'About Us',
      href: '/about',
    },
  ] satisfies NavItem[],
  adminNavbarItems: [
    {
      label: 'Overview',
      href: '/dashboard',
    },
    {
      label: 'User Management',
      href: '/dashboard/user',
    },
    {
      label: 'Product Management',
      href: '/dashboard/product',
    },
    {
      label: 'Order Management',
      href: '/dashboard/order',
    },
  ] satisfies NavItem[],
}

export type { SiteConfig, NavItem }
export { siteConfig }
