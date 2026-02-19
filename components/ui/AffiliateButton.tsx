'use client'

import type { ComponentProps } from 'react'

import { cn } from '@/utils'

interface Props extends ComponentProps<'button'> {
  variant?: 'primary' | 'outline'
  className?: string
}

const AffiliateButton = ({
  children,
  variant = 'primary',
  className,
  ...props
}: Props) => {
  const variants = {
    primary: 'bg-faos-amber text-faos-dark hover:bg-amber-400 shadow-xl',
    outline:
      'border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10',
  }

  return (
    <button
      className={cn(
        'cursor-pointer rounded-full px-10 py-4 text-base font-bold transition-all active:scale-95 disabled:opacity-50 sm:text-lg',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { AffiliateButton }
