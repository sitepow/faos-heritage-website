'use client'

import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { NavbarLocaleSwitcher } from './NavbarLocaleSwitcher'
import { Container } from '../../Container'

import { ThemeSwitch } from '@/components/ui/ThemeSwitch'
import { cn } from '@/utils/style'

const NavbarTopBar = ({ className, ...props }: ComponentProps<'div'>) => {
  const tBrand = useTranslations('brand')

  return (
    <div
      className={cn(
        'relative z-20 border-b border-neutral-200/60 bg-neutral-50/90 text-neutral-600 backdrop-blur-xs transition-colors dark:border-neutral-800/60 dark:bg-neutral-950/90 dark:text-neutral-400',
        className,
      )}
      {...props}
    >
      <Container className='flex h-9 items-center justify-between gap-4 px-4 sm:px-6'>
        {/* Left: Brand Slogan */}
        <div className='flex items-center gap-2 overflow-hidden'>
          <Sparkles className='h-3.5 w-3.5 shrink-0 text-[#ba8c25] dark:text-[#f59e0b]' />
          <p className='truncate text-xs font-medium tracking-wide'>
            {tBrand('slogan')}
          </p>
        </div>

        {/* Right: Language / Currency & Theme */}
        <div className='flex shrink-0 items-center gap-2.5'>
          <NavbarLocaleSwitcher />
          <div className='h-3.5 w-px bg-neutral-200 dark:bg-neutral-800' />
          <ThemeSwitch />
        </div>
      </Container>
    </div>
  )
}

export { NavbarTopBar }
