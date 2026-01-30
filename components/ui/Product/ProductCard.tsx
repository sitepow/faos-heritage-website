'use client'

import { Card, CardBody, CardHeader, cn, Image, Skeleton } from '@heroui/react'
import Link from 'next/link'

import type { GetProductResult } from '@/features/product/action'

import { OutOfStockOverlay } from './OutOfStockOverlay'
import { ProductChip } from './ProductChip'

import { ProductPrice } from '@/app/[locale]/(main)/products/[slug]/_components/ProductPrice'
import {
  resolveProductImages,
  checkIsOutOfStock,
  generateSlugWithId,
  resolveProductUnitLabel,
} from '@/utils'

interface ProductCardProps {
  className?: string
  product: GetProductResult
}

const ProductCardSkeleton = () => (
  <Skeleton className='h-[420px] w-full rounded-[60%_40%_30%_70%/60%_30%_70%_40%]' />
)

const ProductCard = ({ className, product }: ProductCardProps) => {
  const { primarySrc } = resolveProductImages(product)

  const isOutOfStock = checkIsOutOfStock({
    stockMin: product.stockMin,
    stockMax: product.stockMax,
    stockQuantity: product.stockQuantity,
  })

  const productHref = `/product/${generateSlugWithId(product.name, product.id)}`

  return (
    <Card
      className={cn(
        'group flex min-h-[440px] w-full flex-col border-none bg-transparent shadow-none',
        className,
      )}
      radius='none'
      shadow='none'
    >
      <Link className='block space-y-6' href={productHref}>
        <CardHeader className='relative p-0'>
          <div className='border-divider group-hover:border-primary relative aspect-square w-full overflow-hidden rounded-lg border bg-white group-hover:border-4'>
            {isOutOfStock && <OutOfStockOverlay />}

            <Image
              alt={product.name}
              className={cn(
                'size-full object-contain p-10 transition-all duration-1000',
                'group-hover:scale-110 group-hover:rotate-3',
              )}
              classNames={{ wrapper: 'size-full' }}
              radius='none'
              src={primarySrc}
              width='100%'
            />
          </div>
        </CardHeader>

        <CardBody className='flex flex-col items-center p-0 text-center'>
          <ProductChip
            categoryName={product.category?.name}
            className='mb-2.5 opacity-40 transition-opacity group-hover:opacity-100'
            isAuthentic={product.isAuthentic}
            isPremiumProduct={product.isPremiumProduct}
          />

          <h4 className='line-clamp-2 text-base font-black tracking-tight text-zinc-800 uppercase dark:text-zinc-200'>
            {product.name}
          </h4>

          <ProductPrice
            className='group-hover:text-primary'
            price={product.price}
            priceMax={product.priceMax!}
            priceMin={product.priceMin!}
            unit={resolveProductUnitLabel(product.unit)}
          />
        </CardBody>
      </Link>
    </Card>
  )
}

export { ProductCardSkeleton, ProductCard }
