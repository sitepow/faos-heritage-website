/* eslint-disable @next/next/no-img-element */
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

import { NavbarLocaleSwitcher } from '@/components/layouts/Navbar/_components/NavbarLocaleSwitcher'
import { ThemeSwitch } from '@/components/ui/ThemeSwitch'
import { useCategories } from '@/features/category/hook'
import { getBackgroundStyle } from '@/utils'

const AuthSidebar = () => {
  const locale = useLocale()

  const t = useTranslations('brand')
  const [currentIndex, setCurrentIndex] = useState(0)

  const { data: categories } = useCategories({ locale })

  useEffect(() => {
    if (!categories || categories.length === 0) {
      return
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === categories.length - 1 ? 0 : prevIndex + 1,
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [categories])

  const activeImage = categories?.[currentIndex]?.image
  const backgroundStyle = activeImage
    ? getBackgroundStyle(activeImage)
    : { backgroundColor: '#131314' }

  return (
    <div
      className='hidden size-full flex-col items-center justify-center gap-5 p-5 text-center transition-all duration-1000 ease-in-out sm:flex sm:w-[50%]'
      style={backgroundStyle}
    >
      <img
        alt='Logo'
        className='size-32 object-contain'
        src='/images/logo.png'
      />

      <span className='text-secondary text-2xl font-medium drop-shadow-md lg:w-3/4 xl:w-1/2'>
        {t('name')}
      </span>
      <span className='text-secondary text-2xl font-medium drop-shadow-md lg:w-3/4 xl:w-1/2'>
        {t('slogan')}
      </span>

      <div className='flex items-center gap-2 rounded-full bg-white/10 p-2 backdrop-blur-md dark:bg-black/20'>
        <NavbarLocaleSwitcher />
        <div className='h-4 w-px bg-white/20' />
        <ThemeSwitch />
      </div>
    </div>
  )
}

export { AuthSidebar }
