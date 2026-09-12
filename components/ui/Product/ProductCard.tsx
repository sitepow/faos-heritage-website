'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { memo, useMemo } from 'react'

import type { GetProductsInfiniteResult } from '@/features/product/types'

import { ProductImage } from './ProductImage'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useProductPrice } from '@/features/product/hook'
import { cn, resolveProductImages } from '@/utils'

type ProductItem = GetProductsInfiniteResult['items'][number]

const ProductCardSkeleton = () => {
  return (
    <div className='flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-0 dark:border-neutral-800/80 dark:bg-neutral-900/40'>
      <Skeleton className='aspect-square w-full rounded-none' />
      <div className='flex flex-col gap-2.5 p-3.5 sm:p-4'>
        <Skeleton className='h-3 w-20' />
        <Skeleton className='h-4 w-3/4' />
        <div className='flex items-baseline justify-between pt-1'>
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-3 w-12' />
        </div>
        <Skeleton className='mt-2 h-8 w-full rounded-lg' />
      </div>
    </div>
  )
}

interface Props {
  className?: string
  product: ProductItem
}

const ProductCard = memo(({ className, product }: Props) => {
  const tActions = useTranslations('actions')
  const { primarySrc } = resolveProductImages({ images: product?.images })

  const productHref = useMemo(
    () => (product?.slug ? `/products/${product.slug}` : '#'),
    [product?.slug],
  )

  const { maxDiscountPercentage, displayPrice } = useProductPrice(product)
  const variantsCount = product?.variants?.length || 0

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-[#ba8c25]/50 hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/50 dark:hover:border-[#f59e0b]/50 dark:hover:shadow-neutral-950/60',
        className,
      )}
    >
      {/* Top Image Section */}
      <div className='relative aspect-square w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900/60'>
        <ProductImage
          showBadge
          aspectRatio='square'
          className='size-full'
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

      {/* Content Section */}
      <div className='flex flex-1 flex-col justify-between p-3.5 sm:p-4'>
        <div className='flex flex-col gap-1'>
          {/* Category Name */}
          {product?.category?.name && (
            <span className='truncate text-[11px] font-medium tracking-wider text-neutral-400 uppercase dark:text-neutral-500'>
              {product.category.name}
            </span>
          )}

          {/* Product Title */}
          <h3 className='line-clamp-2 text-sm font-semibold text-neutral-900 transition-colors group-hover:text-[#ba8c25] sm:text-base dark:text-neutral-100 dark:group-hover:text-[#f59e0b]'>
            <Link href={productHref}>{product?.name}</Link>
          </h3>

          {/* Variant Count Hint */}
          {variantsCount > 1 && (
            <span className='text-[11px] font-medium text-neutral-400 dark:text-neutral-500'>
              {variantsCount} options
            </span>
          )}
        </div>

        {/* Price & CTA Section */}
        <div className='mt-3.5 flex flex-col gap-2.5 border-t border-neutral-100 pt-2.5 dark:border-neutral-800/60'>
          <div className='flex items-baseline justify-between'>
            <span className='text-base font-bold text-[#ba8c25] sm:text-lg dark:text-[#f59e0b]'>
              {displayPrice}
            </span>
          </div>

          <Button
            asChild
            className='relative z-20 h-8 w-full rounded-lg text-xs font-medium text-neutral-700 transition-all duration-200 group-hover:bg-[#ba8c25] group-hover:text-white dark:text-neutral-300 dark:group-hover:bg-[#ba8c25] dark:group-hover:text-white'
            size='sm'
            variant='secondary'
          >
            <Link href={productHref}>
              <span>{tActions('more')}</span>
              <ArrowRight className='ml-1 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export { ProductCardSkeleton, ProductCard }
