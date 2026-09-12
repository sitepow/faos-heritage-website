import { getLocale, getTranslations } from 'next-intl/server'

import { Container } from '../Container'
import { NavbarActions } from './_components/NavbarActions'
import { NavbarCartIndicator } from './_components/NavbarCartIndicator'
import { NavbarLogo } from './_components/NavbarLogo'
import { NavbarMenu } from './_components/NavbarMenu'
import { NavbarMobileMenu } from './_components/NavbarMobileMenu'
import { NavbarSearch } from './_components/NavbarSearch'

import { NAV_PATH_MAP } from '@/constants/navigation'
import { getBlogCategories } from '@/features/blog-category/action'
import { getCategories } from '@/features/category/action'

const Navbar = async () => {
  const locale = await getLocale()
  const t = await getTranslations('navigation.navbar')

  const rawLinks = t.raw('links') as Record<string, string>
  const staticLinks = Object.entries(rawLinks).map(([key, label]) => ({
    key,
    label,
    href: NAV_PATH_MAP[key] || '/',
  }))

  const [categories, blogCategories] = await Promise.all([
    getCategories(locale).catch(() => []),
    getBlogCategories({ isActive: true, locale }).catch(() => ({
      success: true as const,
      data: [],
    })),
  ])

  return (
    <div className='relative z-10 w-full border-b border-neutral-200/80 bg-white/85 backdrop-blur-md transition-colors dark:border-neutral-800/80 dark:bg-neutral-950/85'>
      <Container className='flex h-16 items-center justify-between gap-4 px-4 sm:px-6'>
        {/* Left: Brand Logo */}
        <div className='flex items-center gap-3'>
          <NavbarLogo href='/' />
        </div>

        {/* Center: Desktop Navigation Menu */}
        <div className='hidden flex-1 items-center justify-center xl:flex'>
          <NavbarMenu
            blogCategories={blogCategories}
            categories={categories}
            staticLinks={staticLinks}
          />
        </div>

        {/* Right Desktop: Search Bar & Actions (Profile & Cart) */}
        <div className='hidden items-center gap-3 xl:flex'>
          <NavbarSearch className='w-44 lg:w-52' />
          <div className='h-4 w-px bg-neutral-200 dark:bg-neutral-800' />
          <NavbarActions />
        </div>

        {/* Right Mobile: Cart Indicator & Mobile Hamburger Drawer */}
        <div className='flex items-center gap-1.5 xl:hidden'>
          <NavbarCartIndicator />
          <NavbarMobileMenu
            blogCategories={blogCategories}
            categories={categories}
            staticLinks={staticLinks}
          />
        </div>
      </Container>
    </div>
  )
}

export { Navbar }
