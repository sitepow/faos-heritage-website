'use client'

import React, { useRef } from 'react'

import { cn } from '@/utils'

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
}

export const SpotlightCard: React.FC<SpotlightCardProps> = React.memo(
  ({
    children,
    className,
    spotlightColor = 'rgba(186, 140, 37, 0.15)',
    ...props
  }) => {
    const divRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!divRef.current) return
      const rect = divRef.current.getBoundingClientRect()
      divRef.current.style.setProperty(
        '--mouse-x',
        `${e.clientX - rect.left}px`,
      )
      divRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
    }

    const handleFocus = () => {
      divRef.current?.style.setProperty('--spotlight-opacity', '1')
    }

    const handleBlur = () => {
      divRef.current?.style.setProperty('--spotlight-opacity', '0')
    }

    const handleMouseEnter = () => {
      divRef.current?.style.setProperty('--spotlight-opacity', '1')
    }

    const handleMouseLeave = () => {
      divRef.current?.style.setProperty('--spotlight-opacity', '0')
    }

    return (
      <div
        ref={divRef}
        className={cn(
          'relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/70 p-6 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-neutral-900/60',
          'hover:border-[#ba8c25]/40 hover:shadow-lg hover:shadow-[#ba8c25]/5',
          className,
        )}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <div
          className='pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300'
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, -999px) var(--mouse-y, -999px), ${spotlightColor}, transparent 80%)`,
            opacity: 'var(--spotlight-opacity, 0)',
          }}
        />
        {children}
      </div>
    )
  },
)

SpotlightCard.displayName = 'SpotlightCard'
