'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { ComponentProps, FC } from 'react'

import { Carousel } from '@/components/carousel'
import { cn } from '@/utils/style'

interface Props {
  images: string[]
  alt?: string
}

const ProductImagePreview: FC<ComponentProps<'div'> & Props> = ({
  images,
  className,
  alt = 'product-image',
  ...props
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div
      className={cn('flex flex-col gap-2 md:w-[325px] lg:w-[425px]', className)}
      {...props}
    >
      <div className='relative h-[345px] overflow-hidden rounded-lg md:w-[325px] lg:w-[425px]'>
        <Image
          fill
          priority
          alt={alt}
          className='aspect-square shrink-0 object-cover'
          src={images[selectedIndex] || '/no-image.png'}
        />
      </div>

      {images.length > 1 && (
        <Carousel slidesToScroll className='md:gap-2'>
          {images.map((image, index) => (
            <button
              key={image}
              className={cn(
                'relative size-20 shrink-0 cursor-pointer rounded-md border',
                index === selectedIndex ? 'border-primary' : 'border-divider',
              )}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                fill
                alt={`${alt}-${index}`}
                className='aspect-square shrink-0 rounded-md object-cover'
                src={image || '/no-image.png'}
              />
            </button>
          ))}
        </Carousel>
      )}
    </div>
  )
}

export { ProductImagePreview }
