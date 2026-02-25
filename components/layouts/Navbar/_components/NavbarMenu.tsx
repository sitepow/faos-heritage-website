'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
import { ChevronDown } from 'lucide-react'
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

  const MAX_VISIBLE_ITEMS = 3

  const allCategories = [
    ...(blogCategories
      ?.filter(Boolean)
      .map((c) => ({ ...c, type: 'blog' as const })) || []),
    ...(categories?.map((c) => ({ ...c, type: 'product' as const })) || []),
  ]

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
                    endContent={
                      <ChevronDown className='text-default-500' size={14} />
                    }
                  >
                    <MenuItem label='...' />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label='More categories'
                  className='max-h-[400px] w-[250px] overflow-y-auto'
                  variant='flat'
                >
                  {moreItems.map((item) => (
                    <DropdownItem
                      key={item?.slug!}
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
