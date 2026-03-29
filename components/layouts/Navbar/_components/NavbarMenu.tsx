'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
import { ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

import type { NavLink } from './navbar.types'
import type { GetBlogCategoriesResult } from '@/features/blog-category/action'
import type { GetCategoriesResult } from '@/features/category/action'

import { MenuItem } from './MenuItem'
import { Container } from '../../Container'

interface Props {
  staticLinks: NavLink[]
  categories: GetCategoriesResult
  blogCategories: GetBlogCategoriesResult
}

const NavbarMenu = ({ staticLinks, categories, blogCategories }: Props) => {
  const MAX_VISIBLE_ITEMS = 4

  const allCategories = useMemo(() => {
    const blogData = blogCategories?.success ? blogCategories.data : []

    const productData = Array.isArray(categories) ? categories : []

    return [
      ...blogData.map((c) => ({ ...c, type: 'blog' as const })),
      ...productData.map((c) => ({ ...c, type: 'product' as const })),
    ]
  }, [blogCategories, categories])

  const visibleItems = allCategories.slice(0, MAX_VISIBLE_ITEMS)
  const moreItems = allCategories.slice(MAX_VISIBLE_ITEMS)

  return (
    <nav className='hidden py-2 xl:block'>
      <Container>
        <ul className='flex items-center justify-center gap-6'>
          {staticLinks.map((link) => (
            <li key={link.key}>
              <Link href={link.href}>
                <MenuItem label={link.label} />
              </Link>
            </li>
          ))}

          {visibleItems.map((category) => (
            <li key={category.id}>
              <Link
                href={
                  category.type === 'blog'
                    ? `/posts/category/${category.slug}`
                    : `/categories/${category.slug}`
                }
              >
                <MenuItem label={category.name!} />
              </Link>
            </li>
          ))}

          {moreItems.length > 0 && (
            <li>
              <Dropdown placement='bottom-end'>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className='h-auto min-w-fit bg-transparent p-0 transition-opacity hover:opacity-70 data-[hover=true]:bg-transparent'
                    startContent={<ChevronDownIcon className='opacity-70' />}
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label='More categories'
                  className='max-h-[400px] w-[250px] overflow-y-auto'
                  variant='flat'
                >
                  {moreItems.map((item) => (
                    <DropdownItem
                      key={item?.id!}
                      as={Link}
                      className='py-3.5'
                      href={
                        item.type === 'blog'
                          ? `/posts/category/${item.slug}`
                          : `/categories/${item.slug}`
                      }
                    >
                      {item.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </li>
          )}
        </ul>
      </Container>
    </nav>
  )
}

export { NavbarMenu }
