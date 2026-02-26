'use client'

import { Card, CardBody, CardFooter, cn, Skeleton } from '@heroui/react'
import Link from 'next/link'
import { memo, useMemo } from 'react'

import type { GetProductsInfiniteResult } from '@/features/product/product.types'

import { CategoryChip } from '../CategoryChip'
import { DiscountBadge } from './DiscountBadge'
import { ProductImage } from './ProductImage'
import { ProductRating } from './ProductRating'
import { CommentCount } from '../CommentCount'
import { ViewCount } from '../ViewCount'
import { VariantTable } from './VariantTable'
import { Dot } from '../Post/_components/Dot'

import { useProductPrice } from '@/features/product/product.hook'
import { resolveProductImages } from '@/utils'

type ProductItem = GetProductsInfiniteResult['items'][number]

const ProductCardSkeleton = () => <Skeleton className='h-[420px] w-full' />

interface Props {
  className?: string
  product: ProductItem
}

const ProductCard = memo(({ className, product }: Props) => {
  const { primarySrc } = resolveProductImages({ images: product?.images })
  const { maxDiscountPercentage } = useProductPrice(product)

  const productHref = useMemo(
    () => (product?.slug ? `/products/${product.slug}` : '#'),
    [product?.slug],
  )

  return (
    <Card
      as='article'
      className={cn(
        'group border-default-100 relative w-full overflow-hidden border',
        className,
      )}
      radius='sm'
      shadow='none'
    >
      <CardBody className='relative size-full p-0'>
        <Link
          aria-label={product?.name || 'View product'}
          className='absolute inset-0 z-30'
          href={productHref}
        />

        <div className='relative size-full overflow-hidden bg-white'>
          <DiscountBadge
            className='absolute top-3 left-3 z-40'
            percentage={maxDiscountPercentage}
          />

          <ProductImage
            className='h-[500px] w-full border-none object-cover'
            image={primarySrc}
          />

          <div className='from-primary/90 via-primary/40 absolute inset-0 z-10 bg-gradient-to-t to-transparent' />
        </div>

        <div className='absolute inset-0 z-20 flex flex-col justify-end p-5'>
          <div className='flex flex-wrap items-center gap-2'>
            {product?.category?.name && (
              <CategoryChip categoryName={product.category.name} />
            )}

            <ProductRating
              className='text-white'
              reviews={product?.reviews}
              starInactiveColor='text-white'
              totalReviews={product?._count?.reviews || 0}
            />
          </div>

          <h3 className='my-4 line-clamp-2 text-2xl leading-tight font-bold tracking-tight text-white md:text-3xl'>
            {product?.name}
          </h3>

          <footer className='flex flex-col gap-4 border-t border-white/10 pt-4'>
            <div className='flex flex-wrap items-center gap-3 text-[13px] text-white/70'>
              <ViewCount viewCount={product?.viewCount!} />
              <Dot />
              <CommentCount commentCount={product?._count?.comments || 0} />
            </div>
          </footer>
        </div>
      </CardBody>

      <CardFooter className='py-10'>
        <VariantTable variants={product?.variants || []} />
      </CardFooter>
    </Card>
  )
})

export { ProductCardSkeleton, ProductCard }
