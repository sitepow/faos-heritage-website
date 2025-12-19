/* eslint-disable no-nested-ternary */
'use client'

import { Alert } from '@heroui/alert'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Image } from '@heroui/react'
import { Skeleton } from '@heroui/skeleton'
import Link from 'next/link'
import { useState } from 'react'

import type { GetProductResult } from '@/app/(main)/actions/product'
import type { FC } from 'react'

import { ProductRating } from '../product-rating'

import { ProductPrice } from '@/app/(main)/_components/product-price'
import { checkOutOfStock, createSlug, getProductUnit } from '@/utils/helper'
import { cn } from '@/utils/style'

interface Props {
  className?: string
  product: GetProductResult
}

const ProductCard: FC<Props> = ({ className, product }) => {
  const [isHovered, setIsHovered] = useState(false)

  const imageSrc =
    product?.images?.length > 1
      ? isHovered
        ? product?.images[1]?.url
        : product?.images[0]?.url
      : product?.images?.[0]?.url || '/no-image.png'

  const { stockMin, stockMax, stockQuantity } = product
  const isOutOfStock = checkOutOfStock({ stockMin, stockMax, stockQuantity })

  return (
    <Card
      className={cn(
        'flex size-full w-72 flex-none flex-col border border-divider md:min-w-80',
        className,
      )}
      shadow='none'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        className='block'
        href={`/product/${createSlug(product?.name, product?.id)}`}
      >
        <CardHeader className='relative overflow-hidden p-0'>
          {isOutOfStock && (
            <Alert
              className='absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2'
              color='danger'
              description='Out of stock. Please check similar items'
              radius='none'
              variant='faded'
            />
          )}

          <Image
            alt={product?.name}
            className='aspect-square size-full object-cover'
            classNames={{ wrapper: 'w-full' }}
            height={250}
            radius='none'
            src={imageSrc}
            width='100%'
          />
        </CardHeader>

        <CardBody>
          <div className='flex flex-wrap gap-1'>
            {product?.isDemoProduct && (
              <Chip className='text-white' color='primary'>
                Demo product
              </Chip>
            )}

            {product?.isDigitalProduct && (
              <Chip className='text-white' color='primary'>
                Digital product
              </Chip>
            )}

            <Chip className='text-white' color='primary'>
              {product?.category?.name ?? 'No category'}
            </Chip>
          </div>

          <h4 className='line-clamp-1 text-lg font-bold hover:underline'>
            {product?.name}
          </h4>

          <ProductPrice
            price={product?.price}
            priceMax={product?.priceMax!}
            priceMin={product?.priceMin!}
            unit={getProductUnit(product?.unit)}
          />

          <ProductRating />
        </CardBody>
      </Link>
    </Card>
  )
}

const ProductCardSkeleton = () => {
  return (
    <Skeleton className='h-80 w-full rounded-xl supports-[display:flex]:min-w-72' />
  )
}

export { ProductCard, ProductCardSkeleton }
