'use client'

import { MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { MenuItem } from './MenuItem'

import { CustomIcon } from '@/components/ui/CustomIcon'
import { NAV_LINKS } from '@/constants/navigation'
import { useBlogCategories } from '@/features/blog-category/blog-category.hook'
import { useCategories } from '@/features/category/category.hook'
import { cn, generateSlugWithId } from '@/utils'

const NavbarMobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { data: categories } = useCategories()
  const { data: blogCategories } = useBlogCategories({ isActive: true })

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

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
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            className='w-full text-center'
            href={link.href}
            onClick={closeMenu}
          >
            <MenuItem label={link.label} />
          </Link>
        ))}

        {blogCategories && blogCategories.length > 0 && (
          <>
            <hr className='border-default-100 w-full' />
            {blogCategories.filter(Boolean).map((category) => (
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

        <hr className='border-default-100 w-full' />

        {categories?.map(({ name, id }) => {
          const slug = generateSlugWithId(name!, id!)
          return (
            <Link
              key={id}
              className='w-full text-center'
              href={`/categories/${slug}`}
              onClick={closeMenu}
            >
              <MenuItem label={name!} />
            </Link>
          )
        })}
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
