/* eslint-disable no-nested-ternary */
'use client'

import { Alert } from '@heroui/alert'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Image } from '@heroui/react'
import { Skeleton } from '@heroui/skeleton'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import type { GetProductResult } from '@/app/(main)/actions/product'
import type { FC } from 'react'

import { ProductPrice } from '@/app/(main)/_components/product-price'
import { checkOutOfStock, createSlug, getProductUnit } from '@/utils/helper'
import { cn } from '@/utils/style'

interface Props {
  className?: string
  hideIcon?: boolean
  product: GetProductResult
}

const ProductCard: FC<Props> = ({ className, product, hideIcon = 'true' }) => {
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

        <Link
          className='size-full'
          href={`/product/${createSlug(product?.name, product?.id)}`}
        >
          <Image
            alt={product?.name}
            className='aspect-square size-full object-cover'
            classNames={{ wrapper: 'w-full' }}
            height={250}
            radius='none'
            src={imageSrc}
            width='100%'
          />
        </Link>
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

        <h4 className='line-clamp-1 text-lg font-bold'>{product?.name}</h4>

        <ProductPrice
          price={product?.price}
          priceMax={product?.priceMax!}
          priceMin={product?.priceMin!}
          unit={getProductUnit(product?.unit)}
        />
      </CardBody>

      {!hideIcon && (
        <CardFooter className='justify-center border-t border-divider'>
          <Button
            startContent={<ShoppingCartIcon className='text-default-500' />}
            variant='light'
          />
          <Button
            startContent={<HeartIcon className='text-default-500' />}
            variant='light'
          />
        </CardFooter>
      )}
    </Card>
  )
}

const ProductCardSkeleton = () => {
  return (
    <Skeleton className='h-80 w-full rounded-xl supports-[display:flex]:min-w-72' />
  )
}

export { ProductCard, ProductCardSkeleton }
