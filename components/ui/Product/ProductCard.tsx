'use client'

import { cn, Skeleton } from '@heroui/react'
import Link from 'next/link'
import { memo, useMemo } from 'react'

import type { GetProductsInfiniteResult } from '@/features/product/types'

import { ProductImage } from './ProductImage'
import { VariantTable } from './VariantTable'

import { useProductPrice } from '@/features/product/hook'
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

  const { maxDiscountPercentage } = useProductPrice(product)

  return (
    <div
      className={cn(
        'group border-default-100 flex flex-col gap-2 rounded-xl border',
        className,
      )}
    >
      <div className='relative aspect-square w-full rounded-2xl'>
        <ProductImage
          showBadge
          className='size-full object-cover'
          discount={maxDiscountPercentage}
          hasAnyDiscount={product?.hasAnyDiscount}
          image={primarySrc}
        />
        <Link
          aria-label={product?.name || 'View product'}
          className='absolute inset-0 z-10'
          href={productHref}
        />
      </div>

      <div className='flex flex-col gap-5 p-2.5'>
        <h3 className='text-lg tracking-tight sm:text-xl'>{product?.name}</h3>
        <VariantTable variants={product?.variants || []} />
      </div>
    </div>
  )
})

export { ProductCardSkeleton, ProductCard }
