'use client'

import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { SocialIcon } from 'react-social-icons'

import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils/style'

interface SocialShareProps extends ComponentPropsWithoutRef<'div'> {
  url: string
  title?: string
  label?: string
  size?: number
}

const SocialShare = ({
  url,
  title = '',
  label = 'Share :',
  size = 35,
  className,
  ...props
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const SHARE_PLATFORMS = [
    {
      name: 'facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: 'whatsapp',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      {...props}
    >
      {label && (
        <span className='text-sm font-medium text-default-600'>{label}</span>
      )}

      <div className='flex items-center gap-1.5'>
        {SHARE_PLATFORMS.map((item) => (
          <SocialIcon
            key={item.name}
            style={{ width: size, height: size }}
            target='_blank'
            url={item.url}
          />
        ))}

        <button
          aria-label='Copy link'
          className='flex cursor-pointer items-center justify-center rounded-full border border-divider'
          style={{ width: size, height: size }}
          type='button'
          onClick={handleCopy}
        >
          {copied ? <Check className='size-4' /> : <Copy className='size-4' />}
        </button>
      </div>
    </div>
  )
}

export { SocialShare }
