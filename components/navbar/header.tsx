import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { cn } from '@/utils/style'

type NavbarHeaderProps = ComponentProps<'div'>

export const NavbarHeader = ({ className, ...props }: NavbarHeaderProps) => {
  const tHeader = useTranslations('Navbar')

  return (
    <div
      className={cn(
        'bg-primary text-secondary px-6 py-2.5 text-sm sm:text-base',
        className,
      )}
      {...props}
    >
      {tHeader('Header')}
    </div>
  )
}
