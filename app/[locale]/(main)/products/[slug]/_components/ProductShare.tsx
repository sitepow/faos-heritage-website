'use client'

import { Check, Copy, MoveRightIcon } from 'lucide-react'
import { SocialIcon } from 'react-social-icons'

import type { ComponentPropsWithoutRef } from 'react'

import { useProductShare } from '@/hooks/useProductShare'
import { cn } from '@/utils/style'

type Props = ComponentPropsWithoutRef<'div'> & {
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
}: Props) => {
  const { copied, platforms, copy } = useProductShare({ url, title })

  return (
    <div {...props} className={cn('flex flex-col gap-3', className)}>
      {label && (
        <span className='text-default-600 text-sm font-medium'>{label}</span>
      )}

      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex items-center gap-1.5'>
          {platforms.map((item) => {
            return (
              <SocialIcon
                key={item.name}
                style={{ width: size, height: size }}
                target='_blank'
                url={item.url}
              />
            )
          })}
        </div>

        <MoveRightIcon className='text-default-300 size-4 flex-shrink-0' />

        <div className='bg-default-50 border-default-200 flex items-center gap-2 overflow-hidden rounded-full border pl-4'>
          <span className='text-default-500 max-w-[150px] truncate text-xs sm:max-w-[250px]'>
            {url}
          </span>
          <button
            aria-label='Copy link'
            className='border-default-100 flex items-center justify-center rounded-full border bg-white transition-colors hover:bg-gray-50 dark:bg-neutral-800'
            style={{ width: size, height: size }}
            type='button'
            onClick={copy}
          >
            {copied ? (
              <Check className='text-success size-4' />
            ) : (
              <Copy className='size-4' />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export { ProductShare }
