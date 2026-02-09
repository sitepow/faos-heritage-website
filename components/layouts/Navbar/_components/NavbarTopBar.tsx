import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { NavbarLocaleSwitcher } from './NavbarLocaleSwitcher'
import { Container } from '../../Container'

import { ThemeSwitch } from '@/components/ui/ThemeSwitch'
import { cn } from '@/utils/style'

const NavbarTopBar = ({ className, ...props }: ComponentProps<'div'>) => {
  const tNavigation = useTranslations('navigation.navbar')

  return (
    <div className={cn('bg-primary text-secondary', className)} {...props}>
      <Container className='flex flex-wrap items-center justify-between px-5 py-2.5'>
        <span>{tNavigation('slogan')}</span>

        <div className='flex flex-wrap'>
          <NavbarLocaleSwitcher />
          <ThemeSwitch />
        </div>
      </Container>
    </div>
  )
}

export { NavbarTopBar }
