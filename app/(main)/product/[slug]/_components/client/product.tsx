'use client'

import { Button } from '@heroui/button'
import {
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  Alert,
  Select,
  SelectItem,
} from '@heroui/react'
import { Skeleton } from '@heroui/skeleton'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { HeartIcon, ShoppingCartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo, useState, type FC } from 'react'
import { toast } from 'react-toastify'

import type { GetProductResult } from '@/app/(dashboard)/actions/product'

import { getProduct } from '@/app/(dashboard)/actions/product'
import { DetailCard } from '@/app/(main)/_components/card/product/detail'
import { ReviewCard } from '@/app/(main)/_components/card/product/review'
import { ImagePreview } from '@/app/(main)/_components/image-preview'
import { PageNotFound } from '@/app/(main)/_components/page-not-found'
import { ProductPrice } from '@/app/(main)/_components/product-price'
import { ProductRating } from '@/app/(main)/_components/product-rating'
import { SimilarSection } from '@/app/(main)/_components/section/product/similar'
import { SocialShare } from '@/app/(main)/_components/social-share'
import { createCart } from '@/app/(main)/actions/cart'
import { createFavorite } from '@/app/(main)/actions/favorite'
import { BannerAdvertise } from '@/components/banner/advertise'
import { BannerCertificate } from '@/components/banner/certificate'
import { ACCOUNT_TAB } from '@/utils/const'
import { createSlug, getProductUnit } from '@/utils/helper'

interface Props {
  initialProduct: GetProductResult
  productId: string
  userId: string
}

const ProductClient: FC<Props> = ({ initialProduct, productId }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId, userId),
    placeholderData: initialProduct,
    enabled: !!productId,
  })

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
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['carts', userId] }),
        queryClient.invalidateQueries({ queryKey: ['carts', 'count', userId] }),
        queryClient.invalidateQueries({ queryKey: ['product', productId] }),
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

  if (!product) {
    return <PageNotFound>Product not found</PageNotFound>
  }

  const productUnit = getProductUnit(product.unit!)

  return (
    <section className='flex flex-col gap-4'>
      {isLoading ? (
        <Skeleton className='h-5 max-w-72' />
      ) : (
        <Breadcrumbs className='font-bold'>
          <BreadcrumbItem>Homepage</BreadcrumbItem>
          <BreadcrumbItem>{product.category?.name}</BreadcrumbItem>
        </Breadcrumbs>
      )}

      <div className='grid gap-2 lg:grid-cols-2'>
        <Card>
          <CardBody>
            <ImagePreview images={product.images.map((i) => i.url)} />
          </CardBody>
        </Card>

        <Card>
          <CardBody className='flex flex-col gap-3'>
            <ProductPrice
              price={price!}
              priceMax={!variantId ? product.priceMax : null}
              priceMin={!variantId ? product.priceMin : null}
              unit={product.unit}
            />

            <h1 className='text-2xl font-bold'>{product.name}</h1>
            <ProductRating />

            <Alert color={isOutOfStock ? 'danger' : 'default'} variant='faded'>
              <div className='flex flex-col gap-1 text-sm'>
                <span>{product.shortDescription || 'Description: -'}</span>
                <span className='font-medium'>
                  {isOutOfStock
                    ? 'Out of stock'
                    : `In stock: ${stock} ${productUnit}`}
                </span>
              </div>
            </Alert>

            {hasVariants && (
              <Select
                label='Product options'
                selectedKeys={variantId ? [variantId] : []}
                onSelectionChange={(k) =>
                  setVariantId(Array.from(k)[0] as string)
                }
              >
                {product.variants!.map((v) => (
                  <SelectItem key={v.id}>{v.name}</SelectItem>
                ))}
              </Select>
            )}

            <div className='flex gap-2'>
              <Button
                fullWidth
                isDisabled={hasFavorite}
                isLoading={createFavoriteMutation.isPending}
                startContent={
                  !createFavoriteMutation.isPending && <HeartIcon />
                }
                variant='faded'
                onClick={() =>
                  requireAuth('add favorite') && createFavoriteMutation.mutate()
                }
              >
                Add to favorites
              </Button>

              <Button
                fullWidth
                className='text-white'
                color='primary'
                isDisabled={
                  isOutOfStock ||
                  (hasVariants && !variantId) ||
                  createCartMutation.isPending
                }
                isLoading={createCartMutation.isPending}
                startContent={
                  !createCartMutation.isPending && <ShoppingCartIcon />
                }
                onClick={() => {
                  if (!requireAuth('add to cart')) return
                  if (isOutOfStock) return toast.error('Out of stock')
                  createCartMutation.mutate()
                }}
              >
                Add to cart
              </Button>
            </div>

            <SocialShare
              title={product.name}
              url={`${process.env.NEXT_PUBLIC_APP_URL}/product/${createSlug(
                product.name,
                product.id,
              )}`}
            />
          </CardBody>
        </Card>
      </div>

      <DetailCard product={product} />
      <ReviewCard />
      <BannerCertificate />
      <BannerAdvertise />
      <SimilarSection product={product} />
    </section>
  )
}

export { ProductClient }
