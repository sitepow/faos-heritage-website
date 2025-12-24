export type SiteConfig = typeof siteConfig

export interface NavItem {
  label: string
  href: string
}

export const disableSeoConfig = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },
}

export const siteConfig = {
  name: 'FAOS',
  title: 'Premium Organic Olive Oil & Honey — 100% Pure Natural Collection',
  description: '',
  link: {
    login: '/login',
    cart: '/cart',
  },
  mainNavItems: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Payments', href: '/payment' },
    { label: 'About', href: '/about' },
  ] satisfies NavItem[],
  adminNavbarItems: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Users', href: '/dashboard/user' },
    { label: 'Products', href: '/dashboard/product' },
    { label: 'Orders', href: '/dashboard/order' },
  ] satisfies NavItem[],
}
