'use client'

import {
  Card,
  CardBody,
  Select,
  SelectItem,
  Button,
  Avatar,
  NumberInput,
} from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { ProductChip } from './chip'
import { ProductPrice } from './price'
import { ProductRating } from './rating'
import { ProductShare } from './share'
import { useProductDetailStore } from '../store'

import { createFavorite } from '@/app/[locale]/(main)/account'
import { createCart } from '@/app/[locale]/(main)/cart'
import { ACCOUNT_TAB } from '@/utils/features'
import { createSlug } from '@/utils/slug'

export const ProductCart = () => {
  const t = useTranslations('ProductCart')
  const { product } = useProductDetailStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)

  const { data: session } = useSession()
  const userId = session?.user?.id

  const [variantId, setVariantId] = useState<string | null>(null)
  const hasVariants = Boolean(product?.variants?.length)
  const hasFavorite = Boolean(product?.wishlist?.length)

  useEffect(() => {
    const cartVariantId = product?.cart?.[0]?.variantId

    if (cartVariantId) setVariantId(cartVariantId)
  }, [product?.cart])

  const currentVariant = useMemo(
    () => product?.variants?.find((v) => v.id === variantId),
    [product?.variants, variantId],
  )

  const price = currentVariant?.price ?? product?.price
  const stock = currentVariant?.stockQuantity ?? product?.stockQuantity ?? 0
  const isOutOfStock = stock <= 0

  const requireAuth = (action: string) => {
    if (!userId) {
      toast.error(`Please log in first to ${action}`)
      router.push('/login')

      return false
    }

    return true
  }

  const createCartMutation = useMutation({
    mutationFn: () =>
      createCart({
        userId: userId!,
        productId: product!.id,
        variantId: variantId!,
        quantity,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['carts', userId] }),
        queryClient.invalidateQueries({ queryKey: ['carts', 'count', userId] }),
        queryClient.invalidateQueries({ queryKey: ['product', product!.id] }),
      ])
      router.push('/cart')
    },
  })

  const createFavoriteMutation = useMutation({
    mutationFn: () => createFavorite(userId!, product!.id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['account', 'favorites', userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['favorites', 'count', userId],
        }),
      ])
      router.push(`/account?tab=${ACCOUNT_TAB.FAVORITE}`)
    },
  })

  return (
    <Card>
      <CardBody className='flex flex-col gap-3'>
        <div className='flex flex-col'>
          <ProductPrice
            className='mb-2.5'
            price={price!}
            priceMax={!variantId ? product?.priceMax! : null}
            priceMin={!variantId ? product?.priceMin! : null}
            unit={product?.unit}
          />
          <h1 className='text-2xl font-bold'>{product?.name}</h1>
          <ProductRating />
        </div>

        <ProductChip
          isAuthentic={product?.isAuthentic}
          isPremiumProduct={product?.isPremiumProduct}
          isDemoProduct={product?.isDemoProduct}
          isDigitalProduct={product?.isDigitalProduct}
          categoryName={product?.category?.name}
        />

        {product?.shortDescription && (
          <Card className='bg-default-50 dark:bg-default-100' shadow='none'>
            <CardBody className='text-default-600 text-sm'>
              <span className='line-clamp-2'>{product.shortDescription}</span>
            </CardBody>
          </Card>
        )}

        {hasVariants && (
          <div className='flex flex-col gap-2 sm:flex-row'>
            <NumberInput
              label={t('quantity')}
              variant='bordered'
              minValue={1}
              maxValue={stock}
              value={quantity}
              isDisabled={isOutOfStock}
              onValueChange={(value) => {
                if (typeof value === 'number') {
                  setQuantity(value)
                }
              }}
            />

            <Select
              label={t('productOptions')}
              selectedKeys={variantId ? [variantId] : []}
              variant='bordered'
              onSelectionChange={(option) =>
                setVariantId(Array.from(option)[0] as string)
              }
            >
              {(product?.variants ?? []).map((variant) => (
                <SelectItem
                  key={variant.id}
                  startContent={
                    <Avatar src={variant?.image ?? '/images/no-image.png'} />
                  }
                >
                  {variant.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}

        <div className='flex gap-2'>
          <Button
            fullWidth
            isDisabled={hasFavorite}
            isLoading={createFavoriteMutation.isPending}
            startContent={!createFavoriteMutation.isPending && <HeartIcon />}
            variant='faded'
            onClick={() =>
              requireAuth('add favorite') && createFavoriteMutation.mutate()
            }
          >
            <span className='hidden md:block'>{t('addToFavorites')}</span>
          </Button>

          <Button
            fullWidth
            className='text-secondary'
            color='primary'
            isDisabled={
              isOutOfStock ||
              (!!hasVariants && !variantId) ||
              createCartMutation.isPending
            }
            isLoading={createCartMutation.isPending}
            startContent={!createCartMutation.isPending && <ShoppingCartIcon />}
            onClick={() => {
              if (!requireAuth('add to cart')) return
              if (isOutOfStock) return toast.error('Out of stock')
              if (quantity > stock) return toast.error('Quantity exceeds stock')

              createCartMutation.mutate()
            }}
          >
            <span className='hidden md:block'>{t('addToCart')}</span>
          </Button>
        </div>

        <ProductShare
          title={product?.name}
          label={t('share')}
          url={`${process.env.NEXT_PUBLIC_APP_URL}/product/${createSlug(
            product?.name!,
            product?.id!,
          )}`}
        />
      </CardBody>
    </Card>
  )
}
