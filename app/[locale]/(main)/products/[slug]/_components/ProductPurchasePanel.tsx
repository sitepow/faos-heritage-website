'use client'

import { Card, CardBody, Button } from '@heroui/react'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useMemo, useEffect } from 'react'

import { ProductShare } from './ProductShare'

import { CategoryChip } from '@/components/ui/CategoryChip'
import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { VariantTable } from '@/components/ui/Product/VariantTable'
import { VariantSelect } from '@/components/ui/VariantSelect'
import { useCartMutation } from '@/features/cart/cart.mutation'
import { useFavoriteMutation } from '@/features/favorite/favorite.mutation'
import { useProductDetailStore } from '@/features/product/product.store'
import { generateSlugWithId } from '@/utils'

const ProductPurchasePanel = () => {
  const tActions = useTranslations('actions')
  const tCart = useTranslations('productDetail.cartActions')

  const product = useProductDetailStore((state) => state.product)

  const { addToCart, isAdding: isAddingToCart } = useCartMutation()
  const { addToFav, isAdding: isAddingToFav } = useFavoriteMutation()

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product?.variants?.[0]?.id ?? null,
  )

  useEffect(() => {
    if (product?.variants?.[0]?.id) {
      setSelectedVariantId(product.variants[0].id)
    }
  }, [product])

  const selectedVariant = useMemo(() => {
    if (!selectedVariantId || !product?.variants) {
      return null
    }

    return product.variants.find((v) => v.id === selectedVariantId)
  }, [product?.variants, selectedVariantId])

  const currentStock =
    selectedVariant?.stockQuantity ?? product?.stockQuantity ?? 0
  const isOutOfStock = currentStock <= 0
  const hasVariants = Boolean(product?.variants?.length)
  const hasFavorite = Boolean(product?.wishlist?.length)

  if (!product) {
    return null
  }

  const canAddToCart = !isOutOfStock && (!hasVariants || !!selectedVariantId)

  return (
    <Card className='border-default-100 border' radius='sm' shadow='none'>
      <CardBody className='flex flex-col gap-4'>
        <h1 className='py-3 text-xl font-semibold sm:text-2xl lg:text-4xl'>
          {product.name}
        </h1>

        <CategoryChip categoryName={product.category?.name} />

        <VariantTable variants={product?.variants || []} />

        {hasVariants && (
          <VariantSelect
            selectedVariantId={selectedVariantId}
            variants={product.variants ?? []}
            onChange={(id) => setSelectedVariantId(id)}
          />
        )}

        {product.summary && <MarkdownRenderer content={product.summary} />}

        <div className='flex gap-2 pt-4'>
          <Button
            fullWidth
            className='bg-primary/10 border-primary text-primary'
            isLoading={isAddingToFav}
            radius='none'
            size='lg'
            startContent={
              !isAddingToFav && (
                <HeartIcon className={hasFavorite ? 'fill-current' : ''} />
              )
            }
            variant='faded'
            onPress={() => addToFav(product.id)}
          >
            <span className='hidden md:block'>{tCart('fav')}</span>
          </Button>

          <Button
            fullWidth
            className='text-secondary'
            color='primary'
            isDisabled={!canAddToCart}
            isLoading={isAddingToCart}
            radius='none'
            size='lg'
            startContent={!isAddingToCart && <ShoppingCartIcon />}
            onPress={() =>
              addToCart({
                productId: product.id,
                variantId: selectedVariantId,
                quantity: 1,
              })
            }
          >
            <span className='hidden sm:block'>
              {hasVariants && !selectedVariantId ? (
                <span>{tCart('require')}</span>
              ) : (
                <span>{isOutOfStock ? tCart('outOfStock') : tCart('add')}</span>
              )}
            </span>
          </Button>
        </div>

        <ProductShare
          label={tActions('share')}
          title={product.name}
          url={`${process.env.NEXT_PUBLIC_APP_URL}/product/${generateSlugWithId(product.name, product.id)}`}
        />
      </CardBody>
    </Card>
  )
}

export { ProductPurchasePanel }
