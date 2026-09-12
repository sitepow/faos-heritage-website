'use client'

import React, { type CSSProperties, type ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils'

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<'button'> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = '#ffffff',
      shimmerSize = '0.08em',
      shimmerDuration = '2.5s',
      borderRadius = '100px',
      background = 'linear-gradient(135deg, #ba8c25 0%, #966f18 100%)',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/20 px-6 py-3 whitespace-nowrap text-white [background:var(--bg)] dark:text-white',
          'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
          'shadow-[0_4px_20px_rgba(186,140,37,0.35)] hover:shadow-[0_6px_28px_rgba(186,140,37,0.5)]',
          className,
        )}
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as CSSProperties
        }
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            '-z-30 blur-[2px]',
            '[container-type:size] absolute inset-0 overflow-visible',
          )}
        >
          {/* spark */}
          <div className='animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]'>
            {/* spark before */}
            <div className='animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]' />
          </div>
        </div>
        {children}

        {/* Backdrop */}
        <div
          className={cn(
            'insert-0 absolute size-full',
            'rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]',
            'transform-gpu transition-all duration-300 ease-in-out',
            'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
            'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
          )}
        />

        {/* border */}
        <div
          className={cn(
            'absolute inset-0 rounded-[inherit] p-[--cut]',
            'before:absolute before:inset-0 before:rounded-[inherit] before:[background:radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4)_0%,transparent_70%)]',
          )}
        />
      </button>
    )
  },
)

ShimmerButton.displayName = 'ShimmerButton'
