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
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('actions')
  const productData = useMemo(() => {
    return Array.isArray(categories) ? categories : []
  }, [categories])

  const blogData = useMemo(() => {
    return blogCategories?.success ? blogCategories.data : []
  }, [blogCategories])

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

          {productData.length > 0 && (
            <li>
              <Dropdown placement='bottom-start'>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className='h-auto min-w-fit bg-transparent p-0 transition-opacity hover:opacity-70 data-[hover=true]:bg-transparent'
                    endContent={
                      <ChevronDownIcon className='opacity-70' size={16} />
                    }
                  >
                    <MenuItem label={t('productCategory')} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label='Product categories'
                  className='max-h-[400px] w-[250px] overflow-y-auto'
                  variant='flat'
                >
                  {productData.map((item) => (
                    <DropdownItem
                      key={item?.id!}
                      as={Link}
                      className='py-3.5'
                      href={`/categories/${item?.slug!}`}
                    >
                      {item?.name!}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </li>
          )}

          {blogData.length > 0 && (
            <li>
              <Dropdown placement='bottom-start'>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className='h-auto min-w-fit bg-transparent p-0 transition-opacity hover:opacity-70 data-[hover=true]:bg-transparent'
                    endContent={
                      <ChevronDownIcon className='opacity-70' size={16} />
                    }
                  >
                    <MenuItem label={t('blogCategory')} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label='Blog categories'
                  className='max-h-[400px] w-[250px] overflow-y-auto'
                  variant='flat'
                >
                  {blogData.map((item) => (
                    <DropdownItem
                      key={item?.id!}
                      as={Link}
                      className='py-3.5'
                      href={`/posts/category/${item?.slug!}`}
                    >
                      {item?.name!}
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
