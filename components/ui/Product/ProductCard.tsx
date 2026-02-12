'use client'

import { Card, CardBody, cn, Skeleton } from '@heroui/react'
import Link from 'next/link'

type ProductItem = GetProductsInfiniteResult['items'][number]

import type { GetProductsInfiniteResult } from '@/features/product/product.types'

import { CategoryChip } from '../CategoryChip'
import { ProductImage } from './ProductImage'

import { ProductPrice } from '@/components/ui/Product/ProductPrice'
import {
  resolveProductImages,
  generateSlugWithId,
  resolveProductUnitLabel,
} from '@/utils'

interface ProductCardProps {
  className?: string
  product: ProductItem
}

const ProductCardSkeleton = () => <Skeleton className='h-[420px] w-full' />

const ProductCard = ({ className, product }: ProductCardProps) => {
  const { primarySrc } = resolveProductImages({ images: product?.images })

  const productHref = `/products/${generateSlugWithId(product?.name!, product?.id!)}`

  return (
    <Card
      className={cn(
        'group flex w-full flex-col bg-transparent shadow-none',
        className,
      )}
      radius='none'
      shadow='none'
    >
      <Link className='block space-y-6' href={productHref}>
        <ProductImage className='h-[350px] w-full' image={primarySrc} />

        <CardBody className='flex flex-col items-start gap-5 overflow-hidden p-0'>
          <CategoryChip categoryName={product?.category?.name!} />

          <div className='flex flex-col'>
            <h4 className='line-clamp-2 text-xl'>{product?.name}</h4>

            <ProductPrice
              price={product?.price!}
              priceMax={product?.priceMax!}
              priceMin={product?.priceMin!}
              unit={resolveProductUnitLabel(product?.unit!)}
            />
          </div>
        </CardBody>
      </Link>
    </Card>
  )
}

export { ProductCardSkeleton, ProductCard }
