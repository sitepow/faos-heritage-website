'use client'

import { link as linkStyles } from '@heroui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { cn } from '@/utils/style'

type FooterProps = ComponentProps<'footer'>

export const Footer = ({ className, ...props }: FooterProps) => {
  const tFooter = useTranslations('Footer')
  const tSite = useTranslations('Site')
  const year = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'flex w-full flex-wrap items-center justify-between gap-2 px-10 py-2',
        className,
      )}
      {...props}
    >
      <span className='text-default-600'>
        {tFooter('copyright', {
          year,
          name: tSite('name'),
          title: tSite('title'),
        })}
      </span>

      <div className='flex flex-wrap gap-2'>
        <Link
          className={cn(linkStyles({ color: 'foreground' }))}
          href='/privacy'
        >
          {tFooter('Menu.privacy')}
        </Link>
        <span />
      </div>
    </footer>
  )
}
