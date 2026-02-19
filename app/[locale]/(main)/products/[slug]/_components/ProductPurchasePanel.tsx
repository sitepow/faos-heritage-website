'use client'

import { Card, CardBody, Button, Input } from '@heroui/react' // เพิ่ม Input
import { HeartIcon, ShoppingCartIcon, Share2Icon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
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
  const tField = useTranslations('fields')
  const tCart = useTranslations('productDetail.cartActions')
  const locale = useLocale()

  const product = useProductDetailStore((state) => state.product)

  const { addToCart, isAdding: isAddingToCart } = useCartMutation()
  const { addToFav, isAdding: isAddingToFav } = useFavoriteMutation()

  const [affiliateCode, setAffiliateCode] = useState('')

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

  const shareUrl = useMemo(() => {
    if (!product) {
      return ''
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/products/${generateSlugWithId(product.name, product.id)}`

    return affiliateCode.length > 0
      ? `${baseUrl}?ref=${affiliateCode}`
      : baseUrl
  }, [product, locale, affiliateCode])

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

        <div className='bg-default-50 border-default-200 mt-4 flex flex-col gap-3 rounded-md border p-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <Share2Icon className='text-default-500' size={18} />
            <span className='text-sm font-bold'>
              {tActions('shareTitle') || 'สร้างลิงก์แนะนำสินค้า'}
            </span>
          </div>

          <div className='mt-5 flex flex-wrap items-end gap-2'>
            <Input
              className='max-w-[250px]'
              classNames={{
                label: 'text-xs font-medium',
                input: 'text-center font-mono tracking-widest',
              }}
              inputMode='numeric'
              label={tField('affiliateCode')}
              labelPlacement='outside'
              placeholder='0000'
              radius='none'
              size='sm'
              value={affiliateCode}
              variant='bordered'
              onValueChange={(val) => {
                const numeric = val.replace(/[^0-9]/g, '')
                if (numeric.length <= 4) {
                  setAffiliateCode(numeric)
                }
              }}
            />

            <div className='flex-1'>
              <ProductShare
                label={tActions('share')}
                title={product.name}
                url={shareUrl}
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { ProductPurchasePanel }
