import { getLocale, getTranslations } from 'next-intl/server'

import { Container } from '../Container'
import { NavbarLogo } from './_components/NavbarLogo'
import { NavbarMenu } from './_components/NavbarMenu'
import { NavbarMobileMenu } from './_components/NavbarMobileMenu'

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
    getCategories(locale),
    getBlogCategories({ isActive: true, locale }),
  ])

  return (
    <div className='overflow-x-hidden bg-[#ffffff] dark:bg-[#0a0a0a]'>
      <div className='border-default-100 border-b'>
        <Container className='flex items-center justify-between gap-5 p-5 xl:justify-start'>
          <NavbarLogo href={'/'} />
          <NavbarMenu
            blogCategories={blogCategories}
            categories={categories}
            staticLinks={staticLinks}
          />
          <NavbarMobileMenu
            blogCategories={blogCategories}
            categories={categories}
            staticLinks={staticLinks}
          />
        </Container>
      </div>
    </div>
  )
}

export { Navbar }
