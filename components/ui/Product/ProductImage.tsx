import { Image } from '@heroui/react'

import type { ComponentProps } from 'react'

import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils'

interface ProductImageProps extends ComponentProps<'div'> {
  image?: string
  className?: string
}

const ProductImage = ({ image, className, ...props }: ProductImageProps) => {
  return (
    <div
      className={cn(
        'border-default-100 relative aspect-square size-full shrink-0 overflow-hidden rounded-lg border bg-white transition-all duration-1000 ease-in-out',
        className,
      )}
      {...props}
    >
      <Image
        alt='product-image'
        className='size-full object-contain p-2'
        classNames={{
          wrapper: 'absolute inset-0 !max-w-none size-full',
        }}
        radius='none'
        src={image ?? IMAGE_FALLBACK.EMPTY}
      />
    </div>
  )
}

export { ProductImage }
