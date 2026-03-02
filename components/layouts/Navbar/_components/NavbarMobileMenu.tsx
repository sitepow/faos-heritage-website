'use client'

import { MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import type { NavLink } from './navbar.types'
import type { GetBlogCategoriesResult } from '@/features/blog-category/blog-category.action'
import type { GetCategoriesResult } from '@/features/category/category.action'

import { MenuItem } from './MenuItem'

import { CustomIcon } from '@/components/ui/CustomIcon'
import { cn } from '@/utils'

interface Props {
  staticLinks: NavLink[]
  categories: GetCategoriesResult
  blogCategories: GetBlogCategoriesResult
}

const NavbarMobileMenu = ({
  staticLinks,
  categories,
  blogCategories,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const blogData = useMemo(() => {
    return blogCategories?.success ? blogCategories.data : []
  }, [blogCategories])

  const productData = useMemo(() => {
    return Array.isArray(categories) ? categories : []
  }, [categories])

  const menuContent = (
    <div
      className={cn(
        'bg-background fixed inset-0 z-[100] flex h-dvh flex-col p-5 transition-transform duration-300 ease-in-out',
        isMenuOpen
          ? 'translate-x-0 opacity-100'
          : 'pointer-events-none translate-x-full opacity-0',
      )}
    >
      <div className='flex justify-end'>
        <CustomIcon icon={XIcon} onClick={toggleMenu} />
      </div>

      <div className='mt-10 flex flex-col items-center gap-4 overflow-y-auto'>
        {staticLinks.map((link) => (
          <Link
            key={link.key}
            className='w-full text-center'
            href={link.href}
            onClick={closeMenu}
          >
            <MenuItem label={link.label} />
          </Link>
        ))}

        {blogData.length > 0 && (
          <>
            <hr className='border-default-100 w-full' />
            {blogData.map((category) => (
              <Link
                key={category?.id!}
                className='w-full text-center'
                href={`/posts/category/${category?.slug!}`}
                onClick={closeMenu}
              >
                <MenuItem label={category?.name!} />
              </Link>
            ))}
          </>
        )}

        {productData.length > 0 && (
          <>
            <hr className='border-default-100 w-full' />
            {productData.map((category) => (
              <Link
                key={category?.id!}
                className='w-full text-center'
                href={`/categories/${category?.slug!}`}
                onClick={closeMenu}
              >
                <MenuItem label={category?.name!} />
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className='block xl:hidden'>
      <CustomIcon icon={MenuIcon} onClick={toggleMenu} />
      {mounted && createPortal(menuContent, document.body)}
    </div>
  )
}

export { NavbarMobileMenu }
