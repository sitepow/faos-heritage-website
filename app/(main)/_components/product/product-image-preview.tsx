'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Carousel } from '@/components/carousel/carousel'

interface ProductImagePreviewProps {
  images: string[]
  alt?: string
}

const ProductImagePreview = ({
  images,
  alt = 'product-image',
}: ProductImagePreviewProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <Image
        fill
        priority
        alt={`${alt}-${selectedIndex}`}
        className='size-[345px] object-cover'
        src='/placeholder.svg'
      />
    )
  }

  return (
    <div className='flex w-[345px] flex-col gap-2'>
      <div className='relative h-[345px] w-[345px] overflow-hidden rounded-lg'>
        <Image
          fill
          priority
          alt={`${alt}-${selectedIndex}`}
          className='object-cover'
          src={images[selectedIndex] ?? '/placeholder.svg'}
        />
      </div>

      {images.length > 1 && (
        <Carousel slidesToScroll>
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative size-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all hover:opacity-80 ${
                selectedIndex === index ? 'border-red-800' : 'border-gray-200'
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                fill
                alt={`${alt}-thumbnail-${index}`}
                className='object-cover'
                src={image ?? '/placeholder.svg'}
              />
            </button>
          ))}
        </Carousel>
      )}
    </div>
  )
}

export { ProductImagePreview }
