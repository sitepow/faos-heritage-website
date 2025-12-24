'use client'

import { link as linkStyles } from '@heroui/react'
import Link from 'next/link'

import type { ComponentProps } from 'react'

import { getFooter } from '@/utils/app'
import { cn } from '@/utils/style'

type FooterProps = ComponentProps<'footer'>

export const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <footer
      className={cn(
        'flex w-full flex-wrap items-center justify-between gap-2 px-10 py-2',
        className,
      )}
      {...props}
    >
      <span className='text-default-600'>{getFooter()}</span>

      <div className='flex flex-wrap gap-2'>
        <Link
          className={cn(linkStyles({ color: 'foreground' }), 'underline')}
          href='/'
        >
          Privacy Information
        </Link>
        <span />
      </div>
    </footer>
  )
}
