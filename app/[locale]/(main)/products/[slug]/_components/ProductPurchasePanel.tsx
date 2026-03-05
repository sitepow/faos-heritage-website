'use client'

import { Card, CardBody, Button, Divider, Chip } from '@heroui/react'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useMemo, useEffect } from 'react'

import { ProductRating } from './ProductRating'
import { ProductShare } from './ProductShare'

import { CategoryChip } from '@/components/ui/CategoryChip'
import { CommentCount } from '@/components/ui/CommentCount'
import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { VariantTable } from '@/components/ui/Product/VariantTable'
import { VariantSelect } from '@/components/ui/VariantSelect'
import { ViewCount } from '@/components/ui/ViewCount'
import { useAffiliateProfile } from '@/features/affiliate/affiliate.hook'
import { useCartMutation } from '@/features/cart/cart.mutation'
import { useFavoriteMutation } from '@/features/favorite/favorite.mutation'
import { useProductDetailStore } from '@/features/product/product.store'
import { useShortenMutation } from '@/features/shorten/shorten.hook'

const ProductPurchasePanel = () => {
  const tActions = useTranslations('actions')
  const tCart = useTranslations('productDetail.cartActions')
  const locale = useLocale()

  const product = useProductDetailStore((state) => {
    return state.product
  })

  const { data: profile } = useAffiliateProfile()
  const { addToCart, isAdding: isAddingToCart } = useCartMutation()
  const { addToFav, isAdding: isAddingToFav } = useFavoriteMutation()
  const { mutate: shorten } = useShortenMutation()

  const [shortUrl, setShortUrl] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product?.variants?.[0]?.id ?? null,
  )

  const affiliateCode = profile?.affiliateCode ?? ''

  useEffect(() => {
    if (product?.variants?.[0]?.id) {
      setSelectedVariantId(product.variants[0].id)
    }
  }, [product])

  useEffect(() => {
    setShortUrl('')
  }, [product?.id, affiliateCode])

  const selectedVariant = useMemo(() => {
    if (!selectedVariantId || !product?.variants) {
      return null
    }
    return product.variants.find((v) => {
      return v.id === selectedVariantId
    })
  }, [product?.variants, selectedVariantId])

  const currentStock =
    selectedVariant?.stockQuantity ?? product?.stockQuantity ?? 0
  const isOutOfStock = currentStock <= 0
  const hasVariants = Boolean(product?.variants?.length)
  const hasFavorite = Boolean(product?.wishlist?.length)

  const originalShareUrl = useMemo(() => {
    if (!product) {
      return ''
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/products/${product?.slug!}`

    return affiliateCode.length > 0
      ? `${baseUrl}?ref=${affiliateCode}`
      : baseUrl
  }, [product, locale, affiliateCode])

  const handleGenerateShortLink = () => {
    shorten(originalShareUrl, {
      onSuccess: (data) => {
        if (data.shortUrl) {
          setShortUrl(data.shortUrl)
          if (navigator.clipboard) {
            navigator.clipboard.writeText(data.shortUrl)
          }
        }
      },
    })
  }

  if (!product) {
    return null
  }

  const canAddToCart = !isOutOfStock && (!hasVariants || !!selectedVariantId)

  return (
    <Card className='border-default-100 border' radius='sm' shadow='none'>
      <CardBody className='flex flex-col gap-4'>
        <header>
          <div className='flex flex-wrap items-center gap-2'>
            <CategoryChip categoryName={product.category?.name} />
            <ProductRating
              reviews={product.reviews}
              size={16}
              totalReviews={product._count?.reviews || 0}
            />
          </div>

          <h1 className='mt-5 text-3xl leading-tight font-bold tracking-tighter sm:text-4xl lg:text-5xl'>
            {product.name}
          </h1>
        </header>

        <Divider className='bg-default-100' />

        <div className='flex flex-wrap items-center gap-2'>
          <ViewCount viewCount={product?.viewCount || 0} />
          <CommentCount commentCount={product?._count?.comments || 0} />
        </div>

        <Divider className='bg-default-100' />

        <section aria-label='Product variants' className='flex flex-col gap-5'>
          <VariantTable variants={product?.variants || []} />

          {hasVariants && (
            <VariantSelect
              selectedVariantId={selectedVariantId}
              variants={product.variants ?? []}
              onChange={(id) => {
                return setSelectedVariantId(id)
              }}
            />
          )}
        </section>

        {product.summary && (
          <section aria-label='Product summary'>
            <MarkdownRenderer className='-mb-10' content={product.summary} />
          </section>
        )}

        <div className='grid grid-cols-5 gap-2 pt-4'>
          <Button
            fullWidth
            className='bg-primary/10 border-primary text-primary col-span-2 sm:col-span-1'
            isLoading={isAddingToFav}
            radius='none'
            size='lg'
            startContent={
              !isAddingToFav && (
                <HeartIcon className={hasFavorite ? 'fill-current' : ''} />
              )
            }
            variant='faded'
            onPress={() => {
              return addToFav(product.id)
            }}
          />

          <Button
            fullWidth
            className='text-secondary col-span-3 sm:col-span-4'
            color='primary'
            isDisabled={!canAddToCart}
            isLoading={isAddingToCart}
            radius='none'
            size='lg'
            startContent={!isAddingToCart && <ShoppingCartIcon />}
            onPress={() => {
              return addToCart({
                productId: product.id,
                variantId: selectedVariantId,
                quantity: 1,
              })
            }}
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

        <Divider className='bg-default-100' />

        <section
          aria-label='Share Product'
          className='bg-default-50 flex flex-col gap-3 rounded-lg p-4'
        >
          {affiliateCode && (
            <div className='flex items-center justify-end'>
              <Chip
                className='uppercase'
                color='primary'
                radius='none'
                variant='dot'
              >
                Ref: {affiliateCode}
              </Chip>
            </div>
          )}

          <div className='flex-1'>
            <ProductShare
              label={tActions('share')}
              title={product.name}
              url={shortUrl || originalShareUrl}
              onClick={!shortUrl ? handleGenerateShortLink : undefined}
            />
          </div>
        </section>
      </CardBody>
    </Card>
  )
}

export { ProductPurchasePanel }
