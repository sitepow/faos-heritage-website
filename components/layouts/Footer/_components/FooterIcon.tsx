'use client'

import Image from 'next/image'

import type { ComponentProps } from 'react'

import { cn } from '@/utils/style'

interface Props extends ComponentProps<'figure'> {
  src: string
  alt: string
  hover?: boolean
}

const FooterIcon = ({ src, alt, hover, className, ...props }: Props) => (
  <figure
    className={cn(
      'border-default-100 hover:border-primary relative flex size-12 cursor-pointer items-center justify-center rounded-lg border bg-white p-2.5 transition-all sm:size-14',
      className,
    )}
    {...props}
  >
    <Image
      fill
      alt={alt}
      className={cn(
        'object-contain transition-transform duration-300',
        hover && 'hover:scale-110',
      )}
      loading='lazy'
      sizes='(max-width: 640px) 48px, 56px'
      src={src}
    />
  </figure>
)

export { FooterIcon }
