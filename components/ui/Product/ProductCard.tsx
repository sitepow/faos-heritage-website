'use client'

import { Card, CardBody, CardFooter, cn, Skeleton, Button } from '@heroui/react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { memo, useMemo } from 'react'

import type { GetProductsInfiniteResult } from '@/features/product/product.types'

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
  const tActions = useTranslations('actions')
  const { primarySrc } = resolveProductImages({ images: product?.images })

  const productHref = useMemo(
    () => (product?.slug ? `/products/${product.slug}` : '#'),
    [product?.slug],
  )

  return (
    <Card
      as='article'
      className={cn(
        'border-default-200 group relative w-full overflow-hidden border',
        className,
      )}
      radius='lg'
      shadow='none'
    >
      <CardBody className='flex flex-col gap-0 p-0'>
        <div className='relative aspect-square w-full p-4'>
          <ProductImage className='size-full border-none' image={primarySrc} />
          <Link
            aria-label={product?.name || 'View product'}
            className='absolute inset-0 z-10'
            href={productHref}
          />
        </div>

        <div className='flex flex-col gap-3 px-4 pb-4'>
          <h3 className='text-foreground line-clamp-2 min-h-[3rem] text-lg font-bold'>
            {product?.name}
          </h3>

          <VariantTable variants={product?.variants || []} />
        </div>
      </CardBody>

      <CardFooter className='justify-end'>
        <Button variant='bordered'> {tActions('more')}</Button>
      </CardFooter>
    </Card>
  )
})

export { ProductCardSkeleton, ProductCard }
