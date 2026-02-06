'use client'

import { Check, Copy } from 'lucide-react'
import { SocialIcon } from 'react-social-icons'

import type { ComponentPropsWithoutRef } from 'react'

import { useProductShare } from '@/hooks/useProductShare'
import { cn } from '@/utils/style'

type ProductShareProps = ComponentPropsWithoutRef<'div'> & {
  url: string
  title?: string
  label?: string
  size?: number
}

const ProductShare = ({
  url,
  title,
  label = 'Share :',
  size = 35,
  className,
  ...props
}: ProductShareProps) => {
  const { copied, platforms, copy } = useProductShare({ url, title })

  return (
    <div
      {...props}
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      {label && (
        <span className='text-default-600 text-sm font-medium'>{label}</span>
      )}

      <div className='flex items-center gap-1.5'>
        {platforms.map((item) => (
          <SocialIcon
            key={item.name}
            style={{ width: size, height: size }}
            target='_blank'
            url={item.url}
          />
        ))}

        <button
          aria-label='Copy link'
          className='border-default-100 flex items-center justify-center rounded-full border'
          style={{ width: size, height: size }}
          type='button'
          onClick={copy}
        >
          {copied ? <Check className='size-4' /> : <Copy className='size-4' />}
        </button>
      </div>
    </div>
  )
}

export { ProductShare }
