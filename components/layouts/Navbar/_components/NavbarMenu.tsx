'use client'

import Link from 'next/link'

import { MenuItem } from './MenuItem'
import { Container } from '../../Container'

import { NAV_LINKS } from '@/constants/navigation'
import { useBlogCategories } from '@/features/blog-category/blog-category.hook'
import { useCategories } from '@/features/category/category.hook'
import { generateSlugWithId } from '@/utils'

const NavbarMenu = () => {
  const { data: categories } = useCategories()
  const { data: blogCategories } = useBlogCategories({ isActive: true })

  return (
    <Container className='hidden justify-center gap-5 lg:flex'>
      {NAV_LINKS.map((link) => (
        <Link key={link.href} href={link.href}>
          <MenuItem label={link.label} />
        </Link>
      ))}

      {blogCategories?.filter(Boolean).map((category) => (
        <Link key={category?.id!} href={`/posts/category/${category?.slug!}`}>
          <MenuItem label={category?.name!} />
        </Link>
      ))}

      {categories?.map(({ name, id }) => {
        const slug = generateSlugWithId(name!, id!)
        return (
          <Link key={id} href={`/categories/${slug}`}>
            <MenuItem label={name!} />
          </Link>
        )
      })}
    </Container>
  )
}

export { NavbarMenu }
