'use client'

import { Card, CardBody, CardHeader, Image, Skeleton } from '@heroui/react'
import Link from 'next/link'
import { useState } from 'react'

import type { GetProductResult } from '@/app/[locale]/(main)/products/action'

import { ProductChip } from './chip'
import { ProductPrice } from './price'

import { NO_IMAGE } from '@/utils/constants/seo'
import { checkOutOfStock, getProductUnit } from '@/utils/helpers/product'
import { createSlug } from '@/utils/helpers/slug'
import { cn } from '@/utils/style'

interface ProductCardProps {
  className?: string
  product: GetProductResult
}

export const ProductCardSkeleton = () => {
  return (
    <Skeleton className='h-[420px] w-full rounded-[60%_40%_30%_70%/60%_30%_70%_40%]' />
  )
}

export const ProductCard = ({ className, product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const primaryImage =
    product?.images?.find((img) => img.isPrimary) ?? product?.images?.[0]

  const hoverImage =
    product?.images?.find((img) => !img.isPrimary) ?? primaryImage

  const imageSrc = isHovered
    ? (hoverImage?.url ?? NO_IMAGE)
    : (primaryImage?.url ?? NO_IMAGE)

  const { stockMin, stockMax, stockQuantity } = product
  const isOutOfStock = checkOutOfStock({ stockMin, stockMax, stockQuantity })

  return (
    <Card
      className={cn(
        'group flex min-h-[440px] w-full flex-col border-none bg-transparent shadow-none transition-all duration-700',
        className,
      )}
      radius='none'
      shadow='none'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        className='block space-y-6'
        href={`/product/${createSlug(product?.name, product?.id)}`}
      >
        <CardHeader className='relative overflow-visible p-0'>
          <div
            className={cn(
              'border-divider relative aspect-square w-full overflow-hidden rounded-lg border bg-white transition-all duration-1000 ease-in-out',
              // isHovered
              //   ? 'shadow-primary/10 scale-105 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-2xl'
              //   : 'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]',
            )}
          >
            {isOutOfStock && (
              <div className='absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-md'>
                <span className='rounded-full bg-zinc-900 px-4 py-1 text-[10px] font-black text-white uppercase'>
                  Empty
                </span>
              </div>
            )}

            <Image
              alt={product?.name}
              className={cn(
                'size-full object-contain p-10 transition-transform duration-1000',
                isHovered ? 'scale-110 rotate-3' : 'scale-100',
              )}
              classNames={{ wrapper: 'size-full' }}
              radius='none'
              src={imageSrc}
              width='100%'
            />
          </div>
        </CardHeader>

        <CardBody className='flex flex-col items-center p-0 text-center'>
          <ProductChip
            className='mb-2.5 opacity-40 transition-opacity hover:opacity-100'
            isAuthentic={product?.isAuthentic}
            isPremiumProduct={product?.isPremiumProduct}
            categoryName={product?.category?.name}
          />

          <h4 className='line-clamp-2 text-base font-black tracking-tight text-zinc-800 uppercase dark:text-zinc-200'>
            {product?.name}
          </h4>

          <div className='flex flex-col items-center'>
            <ProductPrice
              className='text-primary text-xl font-black'
              price={product?.price}
              priceMax={product?.priceMax!}
              priceMin={product?.priceMin!}
              unit={getProductUnit(product?.unit)}
            />
          </div>
        </CardBody>
      </Link>
    </Card>
  )
}
