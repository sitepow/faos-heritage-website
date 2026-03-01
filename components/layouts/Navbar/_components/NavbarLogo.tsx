'use client'

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

import type { ComponentProps } from 'react'

import { cn } from '@/utils'

const NavbarLogo = ({ className }: ComponentProps<typeof Link>) => {
  return (
    <Link
      className={cn('flex shrink-0 items-center justify-center', className)}
      href='/'
    >
      <img
        alt='FAOS Heritage Food'
        className='h-12 w-auto cursor-pointer transition-opacity hover:opacity-80 md:h-16'
        src='/images/logo.png'
      />
    </Link>
  )
}

export { NavbarLogo }
