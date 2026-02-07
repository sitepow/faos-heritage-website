'use client'

import { MenuIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { MenuItem } from './MenuItem'
import { NavbarLogo } from './NavbarLogo'

import { CustomIcon } from '@/components/ui/CustomIcon'
import { useCategories } from '@/features/category/useCategory'
import { cn, generateSlugWithId } from '@/utils'

const NavbarMobileMenu = () => {
  const router = useRouter()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: categories } = useCategories()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <div className='block lg:hidden'>
      <CustomIcon icon={MenuIcon} onClick={toggleMenu} />

      <div
        className={cn(
          'bg-page fixed inset-0 z-60',
          isMenuOpen
            ? 'translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-full opacity-0',
        )}
      >
        <div className='flex justify-end p-5'>
          <CustomIcon icon={XIcon} onClick={toggleMenu} />
        </div>

        <NavbarLogo />
        <div className='flex flex-col items-center gap-5 pt-10'>
          {categories?.map(({ name, id }) => {
            return (
              <MenuItem
                key={name}
                label={name}
                onClick={() => {
                  toggleMenu()
                  router.push(`/categories/${generateSlugWithId(name!, id!)}`)
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { NavbarMobileMenu }
