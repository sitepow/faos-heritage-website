'use client'

import { ChevronDown, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import type { NavLink } from './navbar.types'
import type { GetBlogCategoriesResult } from '@/features/blog-category/action'
import type { GetCategoriesResult } from '@/features/category/action'

import { MenuItem } from './MenuItem'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useActiveStorefronts } from '@/features/storefront/hook'
import { cn } from '@/utils'

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
  const pathname = usePathname()
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
      .map((index) => menu?.[index])
      .filter((section): section is FooterMenuSection => !!section)
  }, [tFooter])

  return (
    <nav className='flex items-center'>
      <ul className='flex items-center gap-1.5 text-sm font-medium lg:gap-2 xl:gap-3'>
        {staticLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/' && pathname?.startsWith(link.href))

          return (
            <li key={link.key}>
              <Link
                className={cn(
                  'relative inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-[#ba8c25] dark:text-[#f59e0b]'
                    : 'text-neutral-700 hover:bg-neutral-100/70 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/70 dark:hover:text-[#f59e0b]',
                )}
                href={link.href}
              >
                <MenuItem isActive={isActive} label={link.label} />
                {isActive && (
                  <span className='absolute right-3 bottom-0 left-3 h-0.5 rounded-full bg-[#ba8c25] dark:bg-[#f59e0b]' />
                )}
              </Link>
            </li>
          )
        })}

        {/* Product Categories Dropdown */}
        {productData.length > 0 && (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className='group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100/70 hover:text-[#ba8c25] focus-visible:outline-none dark:text-neutral-300 dark:hover:bg-neutral-800/70 dark:hover:text-[#f59e0b]'
                  type='button'
                >
                  <MenuItem label={t('productCategory')} />
                  <ChevronDown className='h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-180' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='max-h-84 w-60 overflow-y-auto p-1.5 shadow-2xl backdrop-blur-md'
              >
                <div className='px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500'>
                  {t('productCategory')}
                </div>
                {productData.map((item) => (
                  <DropdownMenuItem key={item?.id!} asChild className='p-0'>
                    <Link
                      className='flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-[#f59e0b]'
                      href={`/categories/${item?.slug!}`}
                    >
                      <span>{item?.name!}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}

        {/* Blog Categories Dropdown */}
        {blogData.length > 0 && (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className='group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100/70 hover:text-[#ba8c25] focus-visible:outline-none dark:text-neutral-300 dark:hover:bg-neutral-800/70 dark:hover:text-[#f59e0b]'
                  type='button'
                >
                  <MenuItem label={t('blogCategory')} />
                  <ChevronDown className='h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-180' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='max-h-84 w-60 overflow-y-auto p-1.5 shadow-2xl backdrop-blur-md'
              >
                <div className='px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500'>
                  {t('blogCategory')}
                </div>
                {blogData.map((item) => (
                  <DropdownMenuItem key={item?.id!} asChild className='p-0'>
                    <Link
                      className='flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-[#f59e0b]'
                      href={`/posts/category/${item?.slug!}`}
                    >
                      <span>{item?.name!}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        )}

        {/* Footer Sections / Partners Dropdown */}
        {selectedFooterSections.map((section, idx) => (
          <li key={section.title || (section.isPartner ? 'partners' : idx)}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className='group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100/70 hover:text-[#ba8c25] focus-visible:outline-none dark:text-neutral-300 dark:hover:bg-neutral-800/70 dark:hover:text-[#f59e0b]'
                  type='button'
                >
                  <MenuItem label={section.title || ''} />
                  <ChevronDown className='h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-180' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='max-h-84 w-64 overflow-y-auto p-1.5 shadow-2xl backdrop-blur-md'
              >
                <div className='flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase dark:text-neutral-500'>
                  <Sparkles className='h-3 w-3 text-[#ba8c25]' />
                  <span>{section.title || ''}</span>
                </div>
                {section.isPartner
                  ? (storefronts || []).map((storefront) => (
                      <DropdownMenuItem
                        key={storefront.id}
                        asChild
                        className='p-0'
                      >
                        <a
                          className='flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-[#f59e0b]'
                          href={storefront.googleMapUrl || '#'}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          <span>{storefront.name}</span>
                          <span className='text-[10px] text-neutral-400'>
                            Map ↗
                          </span>
                        </a>
                      </DropdownMenuItem>
                    ))
                  : (section.items || []).map((item, itemIdx) => (
                      <DropdownMenuItem
                        key={item.href || item.label || itemIdx}
                        asChild={Boolean(item.href)}
                        className='p-0'
                      >
                        {item.href ? (
                          <Link
                            className='flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-[#f59e0b]'
                            href={item.href}
                          >
                            <span>{item.label || ''}</span>
                          </Link>
                        ) : (
                          <span className='flex w-full px-3 py-2 text-xs text-neutral-400'>
                            {item.label || ''}
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { NavbarMenu }
