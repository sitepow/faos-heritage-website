/* eslint-disable @next/next/no-img-element */
'use client'

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
        'flex w-full flex-col flex-wrap items-center justify-center gap-2 px-10 py-2 text-center',
        className,
      )}
      {...props}
    >
      <img alt='faos-logo' height={100} src='/images/logo.png' width={100} />

      <div className='flex flex-wrap items-center justify-center gap-2'>
        <div className='flex flex-wrap gap-2'>
          <Link href='/privacy'>{tFooter('Menu.privacy')}</Link>
          <span />
        </div>

        <span className='text-default-600'>
          {tFooter('copyright', {
            year,
            name: tSite('name'),
            title: tSite('title'),
          })}
        </span>
      </div>
    </footer>
  )
}
