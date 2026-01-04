'use client'

import {
  Alert,
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
  CardHeader,
  Image,
  Skeleton,
} from '@heroui/react'
import Link from 'next/link'
import { useState } from 'react'

import type { GetProductResult } from '@/app/[locale]/(main)/products/action'

import { ProductChip } from './chip'
import { ProductPrice } from './price'
import { ProductRating } from './rating'

import { NO_IMAGE } from '@/utils/constants'
import { checkOutOfStock, getProductUnit } from '@/utils/features'
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
        'border-divider flex min-h-[420px] w-full flex-col border',
        'shrink-0 basis-[300px] md:basis-[350px]',
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
          <AvatarGroup
            max={3}
            isBordered
            className='absolute bottom-2 left-2 z-50'
          >
            {product?.variants?.map((variant) => (
              <Avatar
                key={variant?.image}
                src={variant?.image ?? '/images/no-image.png'}
              />
            ))}
          </AvatarGroup>

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
          <ProductChip
            isAuthentic={product?.isAuthentic}
            isPremiumProduct={product?.isPremiumProduct}
            isDemoProduct={product?.isDemoProduct}
            isDigitalProduct={product?.isDigitalProduct}
            categoryName={product?.category?.name}
          />
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
