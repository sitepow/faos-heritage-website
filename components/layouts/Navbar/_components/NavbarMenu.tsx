'use client'

import Link from 'next/link'

import { MenuItem } from './MenuItem'
import { Container } from '../../Container'

import { NAV_LINKS } from '@/constants/navigation'
import { useCategories } from '@/features/category/useCategory'
import { generateSlugWithId } from '@/utils'

const NavbarMenu = () => {
  const { data: categories } = useCategories()

  return (
    <Container className='hidden justify-center gap-5 lg:flex'>
      {NAV_LINKS.map((link) => (
        <Link key={link.href} href={link.href}>
          <MenuItem label={link.label} />
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
