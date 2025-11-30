'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Carousel } from '@/components/carousel'
import { cn } from '@/utils/style'

interface Props {
  images: string[]
  alt?: string
}

export const ProductImagePreview = ({ images, alt = 'product-image' }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className='flex flex-col gap-2 md:w-[345px]'>
      <div className='relative h-[345px] overflow-hidden rounded-lg md:w-[345px]'>
        <Image
          fill
          priority
          alt={alt}
          className='object-cover'
          src={images[selectedIndex] || '/placeholder.svg'}
        />
      </div>

      {images.length > 1 && (
        <Carousel slidesToScroll className='md:gap-2'>
          {images.map((image, index) => (
            <button
              key={image}
              className={cn(
                'relative size-12 shrink-0 cursor-pointer rounded-md border',
                index === selectedIndex ? 'border-primary-website' : 'border-divider',
              )}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                fill
                alt={`${alt}-${index}`}
                className='rounded-md object-cover'
                src={image || '/placeholder.svg'}
              />
            </button>
          ))}
        </Carousel>
      )}
    </div>
  )
}
