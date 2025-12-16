import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

const Header: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn('bg-primary px-6 py-2.5 text-white', className)}
      {...props}
    >
      Premium Organic Olive Oil & Honey — 100% Pure Natural Collection
    </div>
  )
}

export { Header }
