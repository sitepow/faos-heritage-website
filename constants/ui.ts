interface NavItem {
  key: string
  label: string
  href: string
}

const BRAND_COLORS = {
  primary: '#ba8c25',
}

const BREAKPOINTS = {
  TABLET: '1024px',
}

const PAGINATION = {
  ITEMS_PER_PAGE: 8,
}

const IMAGE_FALLBACK = {
  OG: `${process.env.NEXT_PUBLIC_APP_URL}/images/honey.jpg`,
  EMPTY: '/images/no-image.jpg',
}

const ROUTES = {
  PROTECTED: ['/dashboard', '/cart'],
  AUTH: ['/login', '/register'],
}

const DISABLE_SEO_CONFIG = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },
}

const DASHBOARD_NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { key: 'users', label: 'Users', href: '/dashboard/user' },
  { key: 'products', label: 'Products', href: '/dashboard/product' },
  { key: 'orders', label: 'Orders', href: '/dashboard/order' },
] as const satisfies readonly NavItem[]

export {
  BRAND_COLORS,
  BREAKPOINTS,
  PAGINATION,
  IMAGE_FALLBACK,
  ROUTES,
  DISABLE_SEO_CONFIG,
  DASHBOARD_NAV_ITEMS,
}
export type { NavItem }
