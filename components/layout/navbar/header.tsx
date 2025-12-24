import type { ComponentProps } from 'react'

import { cn } from '@/utils/style'

type NavbarHeaderProps = ComponentProps<'div'>

export const NavbarHeader = ({ className, ...props }: NavbarHeaderProps) => {
  return (
    <div
      className={cn('bg-primary px-6 py-2.5 text-white', className)}
      {...props}
    >
      Premium Organic Olive Oil & Honey — 100% Pure Natural Collection
    </div>
  )
}
