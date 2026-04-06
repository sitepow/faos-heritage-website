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

import { useActiveStorefronts } from '@/features/storefront/hook'

interface FooterMenuItem {
  label?: string
  href?: string
  image?: string
}

interface FooterMenuSection {
  title?: string
  items?: FooterMenuItem[]
  isGroup?: boolean
  isPartner?: string | boolean
}

interface Props {
  staticLinks: NavLink[]
  categories: GetCategoriesResult
  blogCategories: GetBlogCategoriesResult
}

const NavbarMenu = ({ staticLinks, categories, blogCategories }: Props) => {
  const t = useTranslations('actions')
  const tFooter = useTranslations('footer')
  const { data: storefronts } = useActiveStorefronts({ ignoreAdmin: true })

  const productData = useMemo(() => {
    return Array.isArray(categories) ? categories : []
  }, [categories])

  const blogData = useMemo(() => {
    return blogCategories?.success ? blogCategories.data : []
  }, [blogCategories])

  const selectedFooterSections = useMemo(() => {
    const menu = tFooter.raw('menu') as FooterMenuSection[]
    const targetIndices = [0, 3, 5]

    return targetIndices
      .map((index) => {
        return menu?.[index]
      })
      .filter((section) => {
        return !!section
      })
  }, [tFooter])

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

          {selectedFooterSections.map((section, idx) => (
            <li key={idx}>
              <Dropdown placement='bottom-start'>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className='h-auto min-w-fit bg-transparent p-0 transition-opacity hover:opacity-70 data-[hover=true]:bg-transparent'
                    endContent={
                      <ChevronDownIcon className='opacity-70' size={16} />
                    }
                  >
                    <MenuItem label={section.title || ''} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label={section.title || 'Footer menu'}
                  className='max-h-[400px] w-[250px] overflow-y-auto'
                  variant='flat'
                >
                  {section.isPartner
                    ? (storefronts || []).map((storefront) => (
                        <DropdownItem
                          key={storefront.id}
                          as='a'
                          className='py-3.5'
                          href={storefront.googleMapUrl || '#'}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          {storefront.name}
                        </DropdownItem>
                      ))
                    : (section.items || []).map((item, itemIdx) => (
                        <DropdownItem
                          key={itemIdx}
                          as={item.href ? Link : 'div'}
                          className='py-3.5'
                          href={item.href || '#'}
                        >
                          {item.label || ''}
                        </DropdownItem>
                      ))}
                </DropdownMenu>
              </Dropdown>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  )
}

export { NavbarMenu }
