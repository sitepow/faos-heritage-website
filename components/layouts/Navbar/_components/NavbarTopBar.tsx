'use client'

import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { NavbarLocaleSwitcher } from './NavbarLocaleSwitcher'
import { Container } from '../../Container'

import { ThemeSwitch } from '@/components/ui/ThemeSwitch'
import { cn } from '@/utils/style'

const NavbarTopBar = ({ className, ...props }: ComponentProps<'div'>) => {
  const tBrand = useTranslations('brand')

  return (
    <div className={cn('bg-primary text-secondary', className)} {...props}>
      <Container className='flex flex-wrap items-center justify-between px-5 py-2.5'>
        <p className='text-sm font-medium tracking-wide'>{tBrand('slogan')}</p>

        <div className='flex flex-wrap items-center gap-2'>
          <NavbarLocaleSwitcher />
          <ThemeSwitch />
        </div>
      </Container>
    </div>
  )
}

export { NavbarTopBar }
