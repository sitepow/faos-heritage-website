/* eslint-disable @next/next/no-img-element */
import { Button } from '@heroui/react'
import { MenuIcon, XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { NavbarHeader } from '@/components/Navbar/Header'
import { NavbarPanel } from '@/components/Navbar/Panel'
import { siteConfig } from '@/constants/site'

export const AdminNavbar = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const translateNavbar = useTranslations('Navbar.Menu')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className='sticky top-0 z-50 flex w-full flex-col bg-[#f1f1f1ec] backdrop-blur-md dark:bg-[#131314ec]'>
      {isMenuOpen && (
        <div className='fixed inset-0 z-60 h-dvh bg-[#f1f1f1] dark:bg-[#131314]'>
          <div className='flex w-full justify-end'>
            <Button
              isIconOnly
              variant='light'
              onClick={() => setIsMenuOpen(false)}
            >
              <XIcon />
            </Button>
          </div>

          <nav className='flex flex-col gap-4 p-5'>
            {siteConfig.adminNavbarItems?.map((item) => (
              <button
                key={item.href}
                className='hover:text-primary text-left text-base transition-colors'
                onClick={() => {
                  setIsMenuOpen(false)
                  router.push(item.href)
                }}
              >
                {translateNavbar(item.label)}
              </button>
            ))}
          </nav>
        </div>
      )}

      <NavbarHeader />

      <div className='border-divider w-full border-b'>
        <div className='container mx-auto flex items-center justify-between gap-4 px-5 py-2.5 md:gap-8'>
          <div className='flex gap-5'>
            <img
              src='/images/logo.png'
              alt='Logo'
              className='size-[55px] shrink-0 cursor-pointer rounded-md object-contain md:size-[75px]'
              onClick={() => {
                router.push('/')
              }}
            />

            <div className='hidden w-full flex-wrap items-center justify-center gap-5 md:flex'>
              {siteConfig.adminNavbarItems?.map((item) => (
                <span
                  className='hover:text-primary decoration-primary cursor-pointer'
                  onClick={() => {
                    router.push(item?.href)
                  }}
                >
                  {translateNavbar(item?.label)}
                </span>
              ))}
            </div>
          </div>

          <div className='flex items-center'>
            {session && <NavbarPanel />}
            <Button
              isIconOnly
              variant='light'
              className='md:hidden'
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
              }}
            >
              <MenuIcon />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
