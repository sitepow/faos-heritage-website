'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'

import { MenuItem } from './MenuItem'
import { Container } from '../../Container'

import { useBlogCategories } from '@/features/blog-category/blog-category.hook'
import { useCategories } from '@/features/category/category.hook'
import { useStaticNavLinks } from '@/hooks/useStaticNavLinks'
import { generateSlugWithId } from '@/utils'

const NavbarMenu = () => {
  const locale = useLocale()

  const { staticLinks } = useStaticNavLinks()

  const { data: categories } = useCategories({ locale })
  const { data: blogCategories } = useBlogCategories({
    filters: { isActive: true },
    locale,
  })

  return (
    <Container className='hidden flex-wrap justify-center gap-5 xl:flex'>
      {staticLinks.map((link) => (
        <Link key={link.key} href={link.href}>
          <MenuItem label={link.label} />
        </Link>
      ))}

      {blogCategories?.filter(Boolean).map((category) => (
        <Link key={category?.id!} href={`/posts/category/${category?.slug!}`}>
          <MenuItem label={category?.name!} />
        </Link>
      ))}

      {categories?.map((category) => {
        const slug = generateSlugWithId(category?.name!, category?.id!)

        return (
          <Link key={category?.id} href={`/categories/${slug}`}>
            <MenuItem label={category?.name!} />
          </Link>
        )
      })}
    </Container>
  )
}

export { NavbarMenu }
