'use client'

import {
  ChevronDown,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  Sparkles,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

import type { NavLink } from './navbar.types'
import type { GetBlogCategoriesResult } from '@/features/blog-category/action'
import type { GetCategoriesResult } from '@/features/category/action'

import { NavbarLocaleSwitcher } from './NavbarLocaleSwitcher'
import { NavbarSearch } from './NavbarSearch'

import { ThemeSwitch } from '@/components/ui/ThemeSwitch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useCartStat } from '@/features/cart/hooks/useCart'
import { useActiveStorefronts } from '@/features/storefront/hook'
import { useAppNavigation } from '@/hooks/useAppNavigation'
import { useAuth } from '@/hooks/useAuth'

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

const NavbarMobileMenu = ({
  staticLinks,
  categories,
  blogCategories,
}: Props) => {
  const [open, setOpen] = useState(false)
  const [expandProducts, setExpandProducts] = useState(true)
  const [expandBlogs, setExpandBlogs] = useState(false)
  const [expandPartners, setExpandPartners] = useState(false)

  const tNav = useTranslations('navigation.navbar')
  const tActions = useTranslations('actions')
  const tAuth = useTranslations('auth.tabs')
  const tUser = useTranslations('navigation.navbar.userPanel')
  const tFooter = useTranslations('footer')

  const { data: session } = useSession()
  const { isAuthenticated, canManageStock, isPOS, isAdmin } = useAuth()
  const navigation = useAppNavigation()
  const router = useRouter()
  const pathname = usePathname()

  const userId = session?.user?.id
  const { data: cartStat } = useCartStat({ userId })
  const cartCount = cartStat?.totalCarts ?? 0

  const { data: storefronts } = useActiveStorefronts({ ignoreAdmin: true })

  const blogData = useMemo(() => {
    return blogCategories?.success ? blogCategories.data : []
  }, [blogCategories])

  const productData = useMemo(() => {
    return Array.isArray(categories) ? categories : []
  }, [categories])

  const selectedFooterSections = useMemo(() => {
    const menu = tFooter.raw('menu') as FooterMenuSection[]
    const targetIndices = [0, 3, 5]

    return targetIndices
      .map((index) => menu?.[index])
      .filter((section): section is FooterMenuSection => !!section)
  }, [tFooter])

  const closeMenu = () => setOpen(false)

  return (
    <div className='flex items-center xl:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            aria-label='Open Navigation Menu'
            className='h-9 w-9 rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#f59e0b]'
            size='icon'
            variant='ghost'
          >
            <Menu className='h-5 w-5' />
          </Button>
        </SheetTrigger>

        <SheetContent
          className='flex w-full max-w-sm flex-col justify-between overflow-y-auto p-0'
          side='right'
        >
          {/* Top Section */}
          <div className='flex flex-col'>
            {/* Header */}
            <SheetHeader className='border-b border-neutral-200/80 px-5 py-4 dark:border-neutral-800/80'>
              <SheetTitle className='flex items-center gap-2 text-left font-bold text-neutral-900 dark:text-neutral-100'>
                <span className='h-2 w-2 rounded-full bg-[#ba8c25]' />
                <span>FAOS Heritage Food</span>
              </SheetTitle>
            </SheetHeader>

            {/* Mobile Search */}
            <div className='border-b border-neutral-100 px-5 py-3 dark:border-neutral-800/50'>
              <NavbarSearch onSearchSubmit={closeMenu} />
            </div>

            {/* User Session Quick Profile */}
            <div className='border-b border-neutral-100 bg-neutral-50/70 px-5 py-3 dark:border-neutral-800/50 dark:bg-neutral-900/40'>
              {isAuthenticated ? (
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2.5 overflow-hidden'>
                    <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ba8c25]/15 text-xs font-semibold text-[#ba8c25]'>
                      {session?.user?.name?.[0]?.toUpperCase() || (
                        <User className='h-4 w-4' />
                      )}
                    </div>
                    <div className='truncate'>
                      <p className='truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100'>
                        {session?.user?.name || session?.user?.email}
                      </p>
                      {session?.user?.name && session?.user?.email && (
                        <p className='truncate text-[10px] text-neutral-400'>
                          {session?.user?.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    className='h-7 px-2 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40'
                    size='sm'
                    variant='ghost'
                    onClick={() => {
                      closeMenu()
                      signOut({ callbackUrl: '/' })
                    }}
                  >
                    <LogOut className='mr-1 h-3 w-3' />
                    <span>{tUser('logout')}</span>
                  </Button>
                </div>
              ) : (
                <div className='flex items-center justify-between'>
                  <span className='text-xs text-neutral-500 dark:text-neutral-400'>
                    {tNav('slogan')}
                  </span>
                  <Button
                    className='h-7 gap-1 px-3 text-xs'
                    size='sm'
                    variant='default'
                    onClick={() => {
                      closeMenu()
                      navigation.LOGIN()
                    }}
                  >
                    <LogIn className='h-3.5 w-3.5' />
                    <span>{tAuth('login')}</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className='flex flex-col space-y-1 p-3'>
              {staticLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.key}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-100 font-semibold text-[#ba8c25] dark:bg-neutral-800/80 dark:text-[#f59e0b]'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                    }`}
                    href={link.href}
                    onClick={closeMenu}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className='h-3.5 w-3.5 opacity-40' />
                  </Link>
                )
              })}

              {/* Cart link in mobile nav */}
              <Link
                className='flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                href='/cart'
                onClick={closeMenu}
              >
                <div className='flex items-center gap-2'>
                  <ShoppingBag className='h-4 w-4 text-neutral-500' />
                  <span>{tUser('orders')} / Cart</span>
                </div>
                {cartCount > 0 && (
                  <Badge className='h-5 min-w-5 rounded-full bg-[#ba8c25] px-1.5 text-[10px] text-white'>
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {/* User menu items if authenticated */}
              {isAuthenticated && (
                <div className='mt-2 space-y-1 border-t border-neutral-100 pt-2 dark:border-neutral-800'>
                  <Link
                    className='flex items-center justify-between rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                    href='/account'
                    onClick={closeMenu}
                  >
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4 text-neutral-500' />
                      <span>{tUser('account')}</span>
                    </div>
                    <ChevronRight className='h-3.5 w-3.5 opacity-40' />
                  </Link>

                  <Link
                    className='flex items-center justify-between rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                    href='/orders'
                    onClick={closeMenu}
                  >
                    <div className='flex items-center gap-2'>
                      <Package className='h-4 w-4 text-neutral-500' />
                      <span>{tUser('orders')}</span>
                    </div>
                    <ChevronRight className='h-3.5 w-3.5 opacity-40' />
                  </Link>

                  <Link
                    className='flex items-center justify-between rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                    href='/favorite'
                    onClick={closeMenu}
                  >
                    <div className='flex items-center gap-2'>
                      <Heart className='h-4 w-4 text-neutral-500' />
                      <span>{tUser('favorites')}</span>
                    </div>
                    <ChevronRight className='h-3.5 w-3.5 opacity-40' />
                  </Link>

                  {(canManageStock || isPOS) && (
                    <button
                      className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                      type='button'
                      onClick={() => {
                        closeMenu()
                        if (isPOS && !isAdmin && !canManageStock) {
                          router.push('/dashboard/orders')
                        } else {
                          router.push('/dashboard/inventory')
                        }
                      }}
                    >
                      <div className='flex items-center gap-2'>
                        <LayoutDashboard className='h-4 w-4 text-neutral-500' />
                        <span>{tUser('dashboard')}</span>
                      </div>
                      <ChevronRight className='h-3.5 w-3.5 opacity-40' />
                    </button>
                  )}
                </div>
              )}

              {/* Product Categories Collapsible */}
              {productData.length > 0 && (
                <div className='border-t border-neutral-100 pt-2 dark:border-neutral-800'>
                  <button
                    className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800/40'
                    type='button'
                    onClick={() => setExpandProducts((prev) => !prev)}
                  >
                    <div className='flex items-center gap-2'>
                      <span>{tActions('productCategory')}</span>
                      <Badge
                        className='h-4.5 px-1.5 text-[10px]'
                        variant='secondary'
                      >
                        {productData.length}
                      </Badge>
                    </div>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        expandProducts ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandProducts && (
                    <div className='mt-1 space-y-0.5 pl-2'>
                      {productData.map((category) => (
                        <Link
                          key={category?.id!}
                          className='flex items-center justify-between rounded-md px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                          href={`/categories/${category?.slug!}`}
                          onClick={closeMenu}
                        >
                          <span>{category?.name!}</span>
                          <ChevronRight className='h-3 w-3 opacity-30' />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Blog Categories Collapsible */}
              {blogData.length > 0 && (
                <div className='border-t border-neutral-100 pt-2 dark:border-neutral-800'>
                  <button
                    className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800/40'
                    type='button'
                    onClick={() => setExpandBlogs((prev) => !prev)}
                  >
                    <div className='flex items-center gap-2'>
                      <span>{tActions('blogCategory')}</span>
                      <Badge
                        className='h-4.5 px-1.5 text-[10px]'
                        variant='secondary'
                      >
                        {blogData.length}
                      </Badge>
                    </div>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        expandBlogs ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandBlogs && (
                    <div className='mt-1 space-y-0.5 pl-2'>
                      {blogData.map((category) => (
                        <Link
                          key={category?.id!}
                          className='flex items-center justify-between rounded-md px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                          href={`/posts/category/${category?.slug!}`}
                          onClick={closeMenu}
                        >
                          <span>{category?.name!}</span>
                          <ChevronRight className='h-3 w-3 opacity-30' />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Partners / Information Collapsible */}
              {selectedFooterSections.length > 0 && (
                <div className='border-t border-neutral-100 pt-2 dark:border-neutral-800'>
                  <button
                    className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800/40'
                    type='button'
                    onClick={() => setExpandPartners((prev) => !prev)}
                  >
                    <div className='flex items-center gap-1.5'>
                      <Sparkles className='h-3 w-3 text-[#ba8c25]' />
                      <span>
                        {selectedFooterSections[0]?.title || 'Info & Partners'}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        expandPartners ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandPartners && (
                    <div className='mt-1 space-y-0.5 pl-2'>
                      {selectedFooterSections.map((section) =>
                        section.isPartner
                          ? (storefronts || []).map((storefront) => (
                              <a
                                key={storefront.id}
                                className='flex items-center justify-between rounded-md px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                                href={storefront.googleMapUrl || '#'}
                                rel='noopener noreferrer'
                                target='_blank'
                                onClick={closeMenu}
                              >
                                <span>{storefront.name}</span>
                                <span className='text-[10px] text-neutral-400'>
                                  Map ↗
                                </span>
                              </a>
                            ))
                          : (section.items || []).map((item, itemIdx) => (
                              <Link
                                key={item.href || item.label || itemIdx}
                                className='flex items-center justify-between rounded-md px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-[#f59e0b]'
                                href={item.href || '#'}
                                onClick={closeMenu}
                              >
                                <span>{item.label || ''}</span>
                                <ChevronRight className='h-3 w-3 opacity-30' />
                              </Link>
                            )),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls: Language, Currency, Theme */}
          <div className='mt-6 border-t border-neutral-200/80 bg-neutral-50/80 p-4 dark:border-neutral-800/80 dark:bg-neutral-900/60'>
            <div className='flex items-center justify-between gap-3'>
              <NavbarLocaleSwitcher />
              <div className='h-4 w-px bg-neutral-200 dark:bg-neutral-800' />
              <ThemeSwitch />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export { NavbarMobileMenu }
