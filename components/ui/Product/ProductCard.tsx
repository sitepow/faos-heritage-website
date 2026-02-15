'use client'

import { Card, CardBody, cn, Skeleton } from '@heroui/react'
import Link from 'next/link'
import React, { useMemo } from 'react'

import type { GetProductsInfiniteResult } from '@/features/product/product.types'

import { CategoryChip } from '../CategoryChip'
import { ProductImage } from './ProductImage'
import { VariantTable } from './VariantTable'

import { resolveProductImages, generateSlugWithId } from '@/utils'

type ProductItem = GetProductsInfiniteResult['items'][number]

const ProductCardSkeleton = () => <Skeleton className='h-[420px] w-full' />

interface Props {
  className?: string
  product: ProductItem
}

const ProductCard = ({ className, product }: Props) => {
  const { primarySrc } = resolveProductImages({ images: product?.images })

  const productHref = useMemo(
    () =>
      product
        ? `/products/${generateSlugWithId(product.name, product.id)}`
        : '#',
    [product],
  )

  return (
    <Card
      className={cn('flex w-full flex-col gap-4 bg-transparent', className)}
      radius='lg'
      shadow='none'
    >
      <Link href={productHref}>
        <div className='relative overflow-hidden rounded-lg'>
          <ProductImage className='h-[300px] w-full' image={primarySrc} />
        </div>
      </Link>

      <CardBody className='flex flex-col items-start gap-4 overflow-hidden p-1'>
        <CategoryChip categoryName={product?.category?.name} />

        <div className='flex w-full flex-col gap-4'>
          <h4 className='line-clamp-2 text-xl'>{product?.name}</h4>

          <VariantTable variants={product?.variants || []} />
        </div>
      </CardBody>
    </Card>
  )
}

export { ProductCardSkeleton, ProductCard }
