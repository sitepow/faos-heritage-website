'use client'

import { Card, CardBody, Select, SelectItem, Button } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { ProductPrice } from './price'
import { ProductRating } from './rating'
import { ProductShare } from './share'
import { useProductDetailStore } from '../store'

import { createFavorite } from '@/app/(main)/account'
import { createCart } from '@/app/(main)/cart'
import { ACCOUNT_TAB } from '@/utils/features'
import { createSlug } from '@/utils/slug'

export const ProductCart = () => {
  const { product } = useProductDetailStore()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const [variantId, setVariantId] = useState<string | null>(null)
  const hasVariants = Boolean(product?.variants?.length)
  const hasFavorite = Boolean(product?.wishlist?.length)

  useEffect(() => {
    const cartVariantId = product?.cart?.[0]?.variantId

    if (cartVariantId) setVariantId(cartVariantId)
  }, [product?.cart])

  useEffect(() => {
    if (!hasVariants || variantId) return
    setVariantId(product?.variants?.[0]?.id ?? null)
  }, [hasVariants, product?.variants, variantId])

  const currentVariant = useMemo(
    () => product?.variants?.find((v) => v.id === variantId),
    [product?.variants, variantId],
  )

  const price = currentVariant?.price?.toNumber() ?? product?.price?.toNumber()
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
        {product?.shortDescription && (
          <Card className='bg-default-50 dark:bg-default-100' shadow='none'>
            <CardBody className='text-default-600 text-sm'>
              <span className='line-clamp-2'>{product.shortDescription}</span>
            </CardBody>
          </Card>
        )}

        {hasVariants && (
          <Select
            label='Product options'
            selectedKeys={variantId ? [variantId] : []}
            variant='bordered'
            onSelectionChange={(k) => setVariantId(Array.from(k)[0] as string)}
          >
            {(product?.variants ?? []).map((v) => (
              <SelectItem key={v.id}>{v.name}</SelectItem>
            ))}
          </Select>
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
            <span className='hidden md:block'>Add to favorites</span>
          </Button>

          <Button
            fullWidth
            className='text-secondary'
            color='primary'
            isDisabled={
              isOutOfStock ||
              (hasVariants && !variantId) ||
              createCartMutation.isPending
            }
            isLoading={createCartMutation.isPending}
            startContent={!createCartMutation.isPending && <ShoppingCartIcon />}
            onClick={() => {
              if (!requireAuth('add to cart')) return
              if (isOutOfStock) return toast.error('Out of stock')
              createCartMutation.mutate()
            }}
          >
            <span className='hidden md:block'>Add to cart</span>
          </Button>
        </div>

        <ProductShare
          title={product?.name}
          url={`${process.env.NEXT_PUBLIC_APP_URL}/product/${createSlug(
            product?.name!,
            product?.id!,
          )}`}
        />
      </CardBody>
    </Card>
  )
}
