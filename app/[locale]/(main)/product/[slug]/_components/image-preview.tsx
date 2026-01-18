/* eslint-disable react/no-array-index-key */
'use client'

import Image from 'next/image'
// import { useState } from 'react'

import { Carousel } from '@/components/carousel/carousel'
import { NO_IMAGE } from '@/utils/constants/seo'
import { cn } from '@/utils/style'

// type Props = ComponentPropsWithoutRef<'div'> & {
//   images: string[]
//   alt?: string
// }

type Props = {
  images: string[]
  alt?: string
}

export const ProductImagePreview = ({
  images = [],
  alt = 'product-image',
  // className,
  // ...props
}: Props) => {
  // const [selectedIndex, setSelectedIndex] = useState(0)
  const displayImages = images.length > 0 ? images : [NO_IMAGE]
  // const mainImage = displayImages[selectedIndex]

  return (
    <Carousel slidesToScroll autoPlay={false}>
      {displayImages.map((image, index) => {
        // const isActive = index === selectedIndex

        return (
          <button
            key={`${image}-${index}`}
            className={cn(
              'relative aspect-square size-full shrink-0 overflow-hidden rounded-lg bg-white shadow-md transition-all',
            )}
            type='button'
            // onClick={() => setSelectedIndex(index)}
          >
            <Image
              fill
              alt={`${alt}-thumb-${index}`}
              className='object-contain transition-opacity'
              src={image}
            />
          </button>
        )
      })}
    </Carousel>

    // <Card>
    //   <CardBody>
    //     <div
    //       className={cn(
    //         'flex h-fit w-full flex-col gap-3 overflow-hidden sm:h-[500px]',
    //         className,
    //       )}
    //       {...props}
    //     >
    //       <div className='relative aspect-square size-full overflow-hidden'>
    //         <Image
    //           fill
    //           priority
    //           alt={alt}
    //           className='aspect-square object-contain transition-opacity duration-300'
    //           src={mainImage}
    //         />
    //       </div>

    //       {displayImages.length > 1 && (
    //         <Carousel slidesToScroll autoPlay={false}>
    //           {displayImages.map((image, index) => {
    //             const isActive = index === selectedIndex

    //             return (
    //               <button
    //                 key={`${image}-${index}`}
    //                 className={cn(
    //                   'order relative aspect-square size-24 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all',
    //                   isActive
    //                     ? 'border-primary ring-primary/10 ring-2'
    //                     : 'hover:border-default-300 border-divider',
    //                 )}
    //                 type='button'
    //                 onClick={() => setSelectedIndex(index)}
    //               >
    //                 <Image
    //                   fill
    //                   alt={`${alt}-thumb-${index}`}
    //                   className={cn(
    //                     'object-contain transition-opacity',
    //                     isActive
    //                       ? 'opacity-100'
    //                       : 'opacity-60 hover:opacity-100',
    //                   )}
    //                   src={image}
    //                 />
    //               </button>
    //             )
    //           })}
    //         </Carousel>
    //       )}
    //     </div>
    //   </CardBody>
    // </Card>
  )
}
