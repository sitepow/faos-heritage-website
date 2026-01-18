import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { Country } from './country'
import { ThemeSwitch } from '../theme-switch'

import { cn } from '@/utils/style'

type NavbarHeaderProps = ComponentProps<'div'>

export const NavbarHeader = ({ className, ...props }: NavbarHeaderProps) => {
  const tHeader = useTranslations('Navbar')

  return (
    <div
      className={cn('bg-primary text-secondary px-5 py-2.5', className)}
      {...props}
    >
      <div className='gap- container mx-auto flex flex-wrap items-center justify-between'>
        <span>{tHeader('Header')}</span>

        <div className='flex flex-wrap'>
          <Country />
          <ThemeSwitch />
        </div>
      </div>
    </div>
  )
}
