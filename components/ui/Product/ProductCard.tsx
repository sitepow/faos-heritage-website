'use client'

import { Card, CardBody, CardHeader, cn, Skeleton } from '@heroui/react'
import Link from 'next/link'

import type { GetProductResult } from '@/features/product/product.action'

import { ProductChip } from './ProductChip'
import { ProductImage } from './ProductImage'

import { ProductPrice } from '@/components/ui/Product/ProductPrice'
import {
  resolveProductImages,
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
  const { primarySrc } = resolveProductImages({ images: product?.images })

  const productHref = `/products/${generateSlugWithId(product?.name!, product?.id!)}`

  return (
    <Card
      className={cn(
        'group flex w-full flex-col border-none bg-transparent shadow-none',
        className,
      )}
      radius='none'
      shadow='none'
    >
      <Link className='block space-y-6' href={productHref}>
        <CardHeader>
          <ProductImage image={primarySrc} />
        </CardHeader>

        <CardBody className='flex flex-col items-start overflow-hidden p-0'>
          <ProductChip
            categoryName={product?.category?.name!}
            className='mb-2.5 opacity-40 transition-opacity group-hover:opacity-100'
            isAuthentic={product?.isAuthentic}
            isPremiumProduct={product?.isPremiumProduct}
          />

          <h4 className='line-clamp-2 text-xl'>{product?.name}</h4>

          <ProductPrice
            price={product?.price!}
            priceMax={product?.priceMax!}
            priceMin={product?.priceMin!}
            unit={resolveProductUnitLabel(product?.unit!)}
          />
        </CardBody>
      </Link>
    </Card>
  )
}

export { ProductCardSkeleton, ProductCard }
