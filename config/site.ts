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
  link: {
    login: '/login',
    cart: '/cart',
  },

  adminNavbarItems: [
    { label: 'dashboard', href: '/dashboard' },
    { label: 'users', href: '/dashboard/user' },
    { label: 'products', href: '/dashboard/product' },
    { label: 'orders', href: '/dashboard/order' },
  ] satisfies NavItem[],
}
