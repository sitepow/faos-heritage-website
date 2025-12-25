/* eslint-disable no-nested-ternary */
'use client'

import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Image,
  Skeleton,
} from '@heroui/react'
import Link from 'next/link'
import { useState } from 'react'

import type { GetProductResult } from '@/app/(main)/products/action'

import { ProductPrice } from './price'
import { ProductRating } from './rating'

import { checkOutOfStock, getProductUnit } from '@/features'
import { NO_IMAGE } from '@/utils/constants'
import { createSlug } from '@/utils/slug'
import { cn } from '@/utils/style'

interface ProductCardProps {
  className?: string
  product: GetProductResult
}

export const ProductCardSkeleton = () => {
  return (
    <Skeleton className='h-80 w-full rounded-xl supports-[display:flex]:min-w-72' />
  )
}

export const ProductCard = ({ className, product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const imageSrc =
    product?.images?.length > 1
      ? isHovered
        ? product?.images[1]?.url
        : product?.images[0]?.url
      : product?.images?.[0]?.url || NO_IMAGE

  const { stockMin, stockMax, stockQuantity } = product
  const isOutOfStock = checkOutOfStock({ stockMin, stockMax, stockQuantity })

  return (
    <Card
      className={cn(
        'flex min-h-[420px] w-full flex-col',
        'shrink-0 basis-[300px] md:basis-[350px]',
        className,
      )}
      shadow='sm'
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
            className='aspect-square size-full object-contain'
            classNames={{ wrapper: 'w-full' }}
            height={250}
            radius='none'
            src={imageSrc}
            width='100%'
          />
        </CardHeader>

        <CardBody>
          <div className='mb-2.5 flex flex-wrap gap-1'>
            {product?.isDemoProduct && (
              <Chip className='text-secondary' color='primary'>
                Demo product
              </Chip>
            )}

            {product?.isDigitalProduct && (
              <Chip className='text-secondary' color='primary'>
                Digital product
              </Chip>
            )}

            <Chip className='text-secondary' color='primary'>
              {product?.category?.name ?? 'No category'}
            </Chip>
          </div>

          <h4 className='line-clamp-2 text-lg font-bold'>{product?.name}</h4>

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
