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
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { ProductChip } from './chip'
import { ProductPrice } from './price'
import { ProductShare } from './share'
import { createCart } from '../../../cart/action'
import { createFavorite } from '../../../profile/_components/favorite/action'
import { useProductDetailStore } from '../store'

import { ACCOUNT_TAB } from '@/constants/app'
import { generateSlugWithId } from '@/utils/app'
import { cn } from '@/utils/style'

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

  useEffect(() => {
    if (!hasVariants) return
    if (variantId) return

    const firstVariant = product?.variants?.[0]
    if (firstVariant) {
      setVariantId(firstVariant.id)
    }
  }, [product?.variants, hasVariants, variantId])

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
        queryClient.invalidateQueries({ queryKey: ['carts', 'stat', userId] }),
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
    <Card className='border-divider border' radius='sm' shadow='none'>
      <CardBody className='flex flex-col gap-3'>
        <div className='flex flex-col'>
          <h1 className='py-3.5 text-xl font-semibold sm:text-2xl lg:text-4xl'>
            {product?.name}
          </h1>
          <ProductChip
            categoryName={product?.category?.name}
            className='justify-start'
            isAuthentic={product?.isAuthentic}
            isPremiumProduct={product?.isPremiumProduct}
          />
          <ProductPrice
            className='mt-5 items-start'
            price={price!}
            priceMax={!variantId ? product?.priceMax! : null}
            priceMin={!variantId ? product?.priceMin! : null}
            unit={product?.unit}
          />
        </div>

        {product?.shortDescription && (
          <Card className='bg-default-50 dark:bg-default-100'>
            <CardBody>
              <article
                className={cn(
                  'mx-auto table w-full max-w-[920px]',

                  'prose prose-neutral dark:prose-invert',
                  'text-sm leading-relaxed sm:text-base',

                  'prose-p:my-1.5 prose-p:leading-relaxed',

                  'prose-h1:text-lg prose-h1:my-3',
                  'prose-h2:text-base prose-h2:my-2',
                  'prose-h3:text-sm prose-h3:my-2',

                  'prose-ul:my-2 prose-ol:my-2',
                  'prose-li:my-0.5 prose-li:leading-relaxed',

                  'prose-table:my-3',
                  'prose-th:px-3 prose-th:py-2',
                  'prose-td:px-3 prose-td:py-2',

                  'prose-br:leading-none',
                )}
              >
                <ReactMarkdown
                  components={{
                    table: ({ children }) => (
                      <div className='my-3 w-full overflow-x-auto'>
                        <table className='min-w-[700px] rounded-none'>
                          {children}
                        </table>
                      </div>
                    ),
                    img: ({ alt, ...props }) => (
                      <img
                        {...props}
                        alt={alt || product?.name!}
                        className='my-4 w-full rounded-lg'
                        loading='lazy'
                      />
                    ),
                  }}
                  rehypePlugins={[rehypeSanitize]}
                  remarkPlugins={[remarkGfm]}
                >
                  {product?.shortDescription!}
                </ReactMarkdown>
              </article>
            </CardBody>
          </Card>
        )}

        {hasVariants && (
          <div className='flex flex-col gap-2 sm:flex-row'>
            <NumberInput
              classNames={{ inputWrapper: 'shadow-none border-primary' }}
              isDisabled={isOutOfStock}
              label={t('quantity')}
              maxValue={stock}
              minValue={1}
              value={quantity}
              variant='bordered'
              onValueChange={(value) => {
                if (typeof value === 'number') {
                  setQuantity(value)
                }
              }}
            />

            <Select
              classNames={{
                trigger: 'shadow-none border-primary',
              }}
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
                    <Avatar src={variant?.image ?? '/images/no-image.jpg'} />
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
          label={t('share')}
          title={product?.name}
          url={`${process.env.NEXT_PUBLIC_APP_URL}/product/${generateSlugWithId(
            product?.name!,
            product?.id!,
          )}`}
        />
      </CardBody>
    </Card>
  )
}
