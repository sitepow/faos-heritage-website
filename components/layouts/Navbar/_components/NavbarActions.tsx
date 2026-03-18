'use client'

import { Button } from '@heroui/react'
import { SearchIcon, LogInIcon } from 'lucide-react'
import Link from 'next/link'

import type { NavLink } from './navbar.types'
import type { GetBlogCategoriesResult } from '@/features/blog-category/action'
import type { GetCategoriesResult } from '@/features/category/action'

import { AffiliateStatsTicker } from './AffiliateStatsTicker'
import { NavbarCartIndicator } from './NavbarCartIndicator'
import { NavbarMobileMenu } from './NavbarMobileMenu'
import { NavbarUserMenu } from './NavbarUserMenu'

import { CustomIcon } from '@/components/ui/CustomIcon'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  staticLinks: NavLink[]
  categories: GetCategoriesResult
  blogCategories: GetBlogCategoriesResult
}

const NavbarActions = ({ staticLinks, categories, blogCategories }: Props) => {
  const { isAuthenticated } = useAuth()
  const navigation = useAppNavigation()

  return (
    <div className='flex flex-1 items-center justify-end gap-5'>
      <div className='flex flex-wrap items-center gap-4'>
        {isAuthenticated && (
          <div className='ml-4 hidden sm:block'>
            <Link href='/affiliate'>
              <AffiliateStatsTicker />
            </Link>
          </div>
        )}

        <Button isIconOnly className='lg:hidden' variant='light'>
          <CustomIcon icon={SearchIcon} />
        </Button>
        {isAuthenticated ? (
          <NavbarUserMenu />
        ) : (
          <Button isIconOnly variant='light' onPress={navigation.LOGIN}>
            <CustomIcon icon={LogInIcon} />
          </Button>
        )}
        <NavbarMobileMenu
          blogCategories={blogCategories}
          categories={categories}
          staticLinks={staticLinks}
        />
        <div className='bg-divider h-4 w-[1px]' />
        <NavbarCartIndicator />
      </div>
    </div>
  )
}

export { NavbarActions }
