'use client'

import { Card, CardBody, cn, Skeleton } from '@heroui/react'
import Link from 'next/link'
import { memo, useMemo } from 'react'

import type { GetProductsInfiniteResult } from '@/features/product/types'

import { ProductImage } from './ProductImage'
import { VariantTable } from './VariantTable'

import { resolveProductImages } from '@/utils'

type ProductItem = GetProductsInfiniteResult['items'][number]

const ProductCardSkeleton = () => {
  return <Skeleton className='h-[600px] w-full rounded-2xl' />
}

interface Props {
  className?: string
  product: ProductItem
}

const ProductCard = memo(({ className, product }: Props) => {
  const { primarySrc } = resolveProductImages({ images: product?.images })

  const productHref = useMemo(
    () => (product?.slug ? `/products/${product.slug}` : '#'),
    [product?.slug],
  )

  return (
    <div className={cn('group flex flex-col gap-2', className)}>
      <div className='bg-default-100 relative aspect-square w-full overflow-hidden rounded-2xl'>
        <ProductImage
          fill
          className='size-full object-cover transition-transform duration-500 group-hover:scale-105'
          image={primarySrc}
        />
        <Link
          aria-label={product?.name || 'View product'}
          className='absolute inset-0 z-10'
          href={productHref}
        />
      </div>

      <Card
        as='article'
        className='border-default-100 border bg-transparent'
        shadow='none'
      >
        <CardBody className='flex flex-col gap-0 p-4'>
          <div className='flex flex-col gap-4'>
            <h3 className='text-foreground min-h-[3rem] text-2xl leading-tight font-semibold'>
              {product?.name}
            </h3>

            <VariantTable variants={product?.variants || []} />
          </div>
        </CardBody>
      </Card>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export { ProductCardSkeleton, ProductCard }
