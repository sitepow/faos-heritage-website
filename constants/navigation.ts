const NAV_LINKS = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Products',
    href: '/products',
  },
] as const

type NavLink = (typeof NAV_LINKS)[number]

export { NAV_LINKS }
export type { NavLink }
