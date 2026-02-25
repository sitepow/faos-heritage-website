'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

import { MenuItem } from './MenuItem'
import { Container } from '../../Container'

import { useBlogCategories } from '@/features/blog-category/blog-category.hook'
import { useCategories } from '@/features/category/category.hook'
import { useStaticNavLinks } from '@/hooks/useStaticNavLinks'

const NavbarMenu = () => {
  const locale = useLocale()
  const { staticLinks } = useStaticNavLinks()
  const { data: categories } = useCategories({ locale })
  const { data: blogCategories } = useBlogCategories({
    filters: { isActive: true },
    locale,
  })

  return (
    <nav className='hidden xl:block'>
      <Container className='flex flex-wrap justify-center gap-5'>
        <ul className='flex flex-wrap justify-center gap-5'>
          {staticLinks.map((link) => (
            <li key={link.key}>
              <Link href={link.href}>
                <MenuItem label={link.label} />
              </Link>
            </li>
          ))}

          {blogCategories?.filter(Boolean).map((category) => (
            <li key={category?.id}>
              <Link href={`/posts/category/${category?.slug}`}>
                <MenuItem label={category?.name!} />
              </Link>
            </li>
          ))}

          {categories?.map((category) => (
            <li key={category?.id}>
              <Link href={`/categories/${category?.slug}`}>
                <MenuItem label={category?.name!} />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  )
}

export { NavbarMenu }
