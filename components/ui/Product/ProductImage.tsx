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
        className={cn('size-full object-contain object-center p-10')}
        classNames={{
          wrapper: 'size-full !max-w-none',
        }}
        radius='none'
        src={image ?? IMAGE_FALLBACK.EMPTY}
        width='100%'
      />
    </div>
  )
}

export { ProductImage }
