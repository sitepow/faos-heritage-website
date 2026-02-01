import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { NavbarLocaleSwitcher } from './NavbarLocaleSwitcher'

import { ThemeSwitch } from '@/components/ui/ThemeSwitch'
import { cn } from '@/utils/style'

const NavbarTopBar = ({ className, ...props }: ComponentProps<'div'>) => {
  const translateNavigation = useTranslations('navigation.navbar')

  return (
    <div
      className={cn('bg-primary text-secondary px-5 py-2.5', className)}
      {...props}
    >
      <div className='gap- container mx-auto flex flex-wrap items-center justify-between'>
        <span>{translateNavigation('slogan')}</span>

        <div className='flex flex-wrap'>
          <NavbarLocaleSwitcher />
          <ThemeSwitch />
        </div>
      </div>
    </div>
  )
}

export { NavbarTopBar }
