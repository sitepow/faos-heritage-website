/* eslint-disable react/no-array-index-key */
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'

import { cn } from '@/utils'

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  children?: ReactNode
  className?: string
  pauseOnHover?: boolean
  repeat?: number
  reverse?: boolean
  vertical?: boolean
}

export const Marquee: FC<MarqueeProps> = ({
  children,
  className,
  pauseOnHover = false,
  repeat = 4,
  reverse = false,
  vertical = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1.5rem]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
      {...props}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={`marquee-col-${i}`}
          className={cn('flex shrink-0 justify-around [gap:var(--gap)]', {
            '[animation-direction:reverse]': reverse,
            'animate-marquee flex-row': !vertical,
            'animate-marquee-vertical flex-col': vertical,
            'group-hover:[animation-play-state:paused]': pauseOnHover,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
