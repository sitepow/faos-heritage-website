/* eslint-disable no-nested-ternary */
'use client'

import { Alert } from '@heroui/alert'
import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Skeleton } from '@heroui/skeleton'
import {
  CircleQuestionMarkIcon,
  FileIcon,
  HeartIcon,
  ShoppingCartIcon,
  TagIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import type { GetProductResult } from '@/actions/product'
import type { FC } from 'react'

import { StarRating } from '../star-rating'

import { Price } from '@/components/price'
import { createSlug, getProductUnit } from '@/utils/helper'
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
        ? product.images[1].url
        : product.images[0].url
      : product?.images?.[0]?.url || '/placeholder.svg'

  return (
    <Card
      className={cn(
        'flex size-full w-64 flex-none flex-col border border-divider md:min-w-72',
        className,
      )}
      shadow='none'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className='relative overflow-hidden p-0'>
        {product?.stockQuantity === 0 && (
          <Alert
            hideIcon
            className='absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2'
            description='This item is temporarily out of stock.'
            radius='none'
          />
        )}

        <div className='absolute bottom-2 left-2 z-50 flex flex-wrap gap-1'>
          {product?.isDemoProduct && (
            <Chip
              startContent={
                <CircleQuestionMarkIcon className='size-4 text-default-500' />
              }
              variant='faded'
            >
              Product samples
            </Chip>
          )}

          {product?.isDigitalProduct && (
            <Chip
              startContent={<FileIcon className='size-4 text-default-500' />}
              variant='faded'
            >
              Digital products
            </Chip>
          )}

          <Chip
            startContent={<TagIcon className='size-4 text-default-500' />}
            variant='faded'
          >
            {product?.category?.name ?? 'No category'}
          </Chip>
        </div>

        <Link
          className='size-full'
          href={`/product/${createSlug(product?.name, product?.id)}`}
        >
          <Image
            key={imageSrc}
            alt={product?.name}
            className='h-[250px] w-full object-cover'
            height={250}
            src={imageSrc}
            width={250}
          />
        </Link>
      </CardHeader>

      <CardBody>
        <Price
          price={product?.price}
          priceMax={product?.priceMax!}
          priceMin={product?.priceMin!}
          unit={getProductUnit(product?.unit)}
        />
        <h4 className='line-clamp-2 text-lg font-bold'>{product?.name}</h4>
        <StarRating rate={3} />
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
