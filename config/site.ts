type SiteConfig = typeof siteConfig

interface NavItem {
  label: string
  href: string
}

const disableSeoConfig = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },
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
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Payments', href: '/payment' },
    { label: 'About', href: '/about' },
  ] satisfies NavItem[],
  adminNavbarItems: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Users', href: '/dashboard/manager/user' },
    { label: 'Products', href: '/dashboard/manager/product' },
    { label: 'Orders', href: '/dashboard/manager/order' },
  ] satisfies NavItem[],
}

export type { SiteConfig, NavItem }
export { siteConfig, disableSeoConfig }
