/* eslint-disable react/no-array-index-key */

'use client'

import { Card, CardBody } from '@heroui/react'
import Image from 'next/image'
import { useState, type ComponentPropsWithoutRef } from 'react'

import { Carousel } from '@/components/features/carousel/carousel'
import { useIsBelowBreakpoint } from '@/hooks/useIsBelowBreakpoint'
import { useMounted } from '@/hooks/useMounted'
import { IS_TABLET_OR_MOBILE, NO_IMAGE } from '@/utils/constants'
import { cn } from '@/utils/style'

type ProductImagePreviewProps = ComponentPropsWithoutRef<'div'> & {
  images: string[]
  alt?: string
}

export const ProductImagePreview = ({
  images = [],
  alt = 'product-image',
  className,
  ...props
}: ProductImagePreviewProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const isTabletOrMobile = useIsBelowBreakpoint(IS_TABLET_OR_MOBILE)
  const mounted = useMounted()

  const displayImages = images.length > 0 ? images : [NO_IMAGE]
  const mainImage = displayImages[selectedIndex]

  return (
    <Card>
      <CardBody>
        {mounted && (
          <div
            className={cn(
              'flex h-[350px] w-full flex-col gap-3 overflow-hidden lg:flex-row',
              className,
            )}
            {...props}
          >
            {displayImages.length > 1 && (
              <Carousel
                slidesToScroll
                wrapperClassName='order-2 lg:order-1'
                trackClassName='gap-2 lg:h-[350px]'
                isVertical={isTabletOrMobile ? true : false}
              >
                {displayImages.map((image, index) => {
                  const isActive = index === selectedIndex

                  return (
                    <button
                      key={`${image}-${index}`}
                      className={cn(
                        'order relative aspect-square size-20 shrink-0 overflow-hidden border-2 transition-all',
                        isActive
                          ? 'border-primary ring-primary/10 ring-2'
                          : 'border-divider hover:border-default-300',
                      )}
                      type='button'
                      onClick={() => setSelectedIndex(index)}
                    >
                      <Image
                        fill
                        alt={`${alt}-thumb-${index}`}
                        className={cn(
                          'object-cover transition-opacity',
                          isActive
                            ? 'opacity-100'
                            : 'opacity-60 hover:opacity-100',
                        )}
                        src={image}
                      />
                    </button>
                  )
                })}
              </Carousel>
            )}

            <div className='relative order-1 aspect-square size-full overflow-hidden'>
              <Image
                fill
                priority
                alt={alt}
                className='aspect-square object-contain transition-opacity duration-300'
                src={mainImage}
              />
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
