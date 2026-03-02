import { getLocale, getTranslations } from 'next-intl/server'

import { Container } from '../Container'
import { NavbarActions } from './_components/NavbarActions'
import { NavbarLogo } from './_components/NavbarLogo'
import { NavbarMenu } from './_components/NavbarMenu'
import { NavbarSearch } from './_components/NavbarSearch'

import { NAV_PATH_MAP } from '@/constants/navigation'
import { getBlogCategories } from '@/features/blog-category/blog-category.action'
import { getCategories } from '@/features/category/category.action'

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
    <div className='overflow-x-hidden bg-[#ffffffe4] backdrop-blur-md dark:bg-[#0a0a0ae4]'>
      <div className='border-default-100 border-b xl:pb-5'>
        <Container className='flex items-center justify-between gap-4 p-5'>
          <NavbarSearch />
          <NavbarLogo href={'/'} />
          <NavbarActions
            blogCategories={blogCategories}
            categories={categories}
            staticLinks={staticLinks}
          />
        </Container>

        <NavbarMenu
          blogCategories={blogCategories}
          categories={categories}
          staticLinks={staticLinks}
        />
      </div>
    </div>
  )
}

export { Navbar }
