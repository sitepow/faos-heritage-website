import type { CSSProperties, FC, ReactNode } from 'react'

import { cn } from '@/utils'

interface AnimatedShinyTextProps {
  children: ReactNode
  className?: string
  shimmerWidth?: number
}

const AnimatedShinyText: FC<AnimatedShinyTextProps> = ({
  children,
  className,
  shimmerWidth = 100,
}) => {
  return (
    <span
      className={cn(
        'mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70',
        'animate-shiny-text [background-size:var(--shiny-width)_100%] bg-clip-text [background-position:0_0] bg-no-repeat',
        'bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80',
        className,
      )}
      style={
        {
          '--shiny-width': `${shimmerWidth}px`,
        } as CSSProperties
      }
    >
      {children}
    </span>
  )
}

export { AnimatedShinyText }
