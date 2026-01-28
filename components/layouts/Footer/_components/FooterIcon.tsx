/* eslint-disable @next/next/no-img-element */

import { cn } from '@/utils/style'

interface FooterIconProps {
  src: string
  alt: string
  hover?: boolean
}

const FooterIcon = ({ src, alt, hover }: FooterIconProps) => (
  <div className='border-divider hover:border-primary flex size-12 cursor-pointer items-center justify-center rounded-full border bg-white p-2.5 shadow-sm transition-all sm:size-14'>
    <img
      alt={alt}
      className={cn(
        'h-full w-auto object-contain transition-transform duration-300',
        hover && 'cursor-pointer hover:scale-110',
      )}
      src={src}
    />
  </div>
)

export { FooterIcon }
