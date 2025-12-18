'use client'

import { SocialIcon } from 'react-social-icons'

import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils/style'

interface SocialShareProps extends ComponentPropsWithoutRef<'div'> {
  url?: string
  label?: string
  size?: number
}

const SocialShare = ({
  label = 'Share :',
  size = 35,
  className,
  ...props
}: SocialShareProps) => {
  const urls = [
    'https://web.facebook.com',
    'https://www.line.me',
    'https://www.whatsapp.com',
    'https://www.instagram.com',
    'https://www.tiktok.com',
  ]

  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      {...props}
    >
      {label && (
        <span className='text-sm font-medium text-default-600'>{label}</span>
      )}

      <div className='flex items-center gap-1.5'>
        {urls.map((url) => (
          <SocialIcon
            key={url}
            className='transition-transform hover:scale-110 active:scale-95'
            style={{ width: size, height: size }}
            target='_blank'
            url={url}
          />
        ))}
      </div>
    </div>
  )
}

export { SocialShare }
