'use client'

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Image,
  NumberInput,
  Select,
  SelectItem,
  Skeleton,
  useDisclosure,
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState, type ComponentProps } from 'react'

import { updateCart, type GetCartResult } from '../action'
import { useCartStore } from '../store'

import { useAppStore } from '@/app/store'
import { ConfirmModal } from '@/components/confirm-modal'
import { EXCHANGE_RATE_TTL } from '@/utils/constants/app'
import { NO_IMAGE } from '@/utils/constants/seo'
import { getThbExchangeRates } from '@/utils/helpers/currency/exchange'
import { formatCurrency, formatNumber } from '@/utils/helpers/number'
import { getProductUnit } from '@/utils/helpers/product'
import { cn } from '@/utils/style'

type CartItemProps = ComponentProps<typeof Card> & {
  cart: GetCartResult
}

export const CartItemSkeleton = () => {
  return <Skeleton className='h-48 w-full rounded-xl' />
}

export const CartItem = ({ className, cart, ...props }: CartItemProps) => {
  const t = useTranslations('Cart')
  const tUnit = useTranslations('ProductUnit')
  const { country, hasHydrated } = useAppStore()

  const { data: exchangeRates } = useQuery({
    queryKey: ['exchange-rates', 'THB'],
    queryFn: getThbExchangeRates,
    staleTime: EXCHANGE_RATE_TTL,
    gcTime: EXCHANGE_RATE_TTL * 2,
    enabled: hasHydrated,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const CURRENCY_OPTIONS = {
    currency: country?.currency,
    locale: country?.locale,
    rates: exchangeRates,
  }

  const queryClient = useQueryClient()

  const { data: session } = useSession()
  const { setState, onOpenDeleteChange } = useCartStore()

  const { isOpen: isDeleteQtyOpen, onOpenChange: onOpenDeleteQtyChange } =
    useDisclosure()

  const [variantId, setVariantId] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(cart?.quantity)

  const userId = session?.user?.id
  const productUnit = getProductUnit(cart?.product?.unit)

  useEffect(() => {
    if (cart?.variantId) {
      setVariantId(cart?.variantId)
    }
  }, [cart?.variantId])

  const QUERY_KEY = {
    PRODUCT: ['product', cart?.product?.id],
    CART: ['carts', userId],
    CART_COUNT: ['carts', 'count', userId],
  }

  const { mutate: mutateUpdateCart, isPending: isPendingUpdateCart } =
    useMutation({
      mutationFn: updateCart,
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY_KEY.PRODUCT }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEY.CART }),
          queryClient.invalidateQueries({ queryKey: QUERY_KEY.CART_COUNT }),
        ])
      },
    })

  const currentVariant = useMemo(() => {
    return cart?.product?.variants?.find((variant) => variant?.id === variantId)
  }, [cart?.product?.variants, variantId])

  const currentPrice = currentVariant?.price ?? cart?.product?.price
  const currentStockQuantity =
    currentVariant?.stockQuantity ?? cart?.product?.stockQuantity

  useEffect(() => {
    setQuantity(cart?.quantity)
  }, [cart?.quantity])

  useEffect(() => {
    if (!cart?.id || quantity === cart?.quantity) return

    const handler = setTimeout(() => {
      if (quantity === 0) {
        onOpenDeleteQtyChange()

        return
      }

      mutateUpdateCart({
        cartId: cart?.id,
        quantity: Number(quantity),
        variantId: variantId!,
      })
    }, 500)

    return () => clearTimeout(handler)
  }, [
    cart?.id,
    mutateUpdateCart,
    onOpenDeleteQtyChange,
    quantity,
    cart?.quantity,
    variantId,
  ])

  const onQuantityChange = (value: unknown) => {
    const newQty = Number(value)

    if (newQty > currentStockQuantity) {
      setQuantity(currentStockQuantity)

      return
    }

    if (newQty === 0) {
      onOpenDeleteQtyChange()

      return
    }

    setQuantity(newQty)
  }

  const onVariantChange = (keys: Iterable<unknown> | ArrayLike<unknown>) => {
    const selected = Array.from(keys)[0]
    const variantId = String(selected)

    setVariantId(variantId)
    if (cart?.id && quantity) {
      mutateUpdateCart({
        cartId: cart?.id,
        quantity: Number(quantity),
        variantId: variantId!,
      })
    }
  }

  const onDeleteCart = () => {
    setState({ cartId: cart?.id })
    onOpenDeleteChange()
  }

  return (
    <>
      <ConfirmModal
        isOpen={isDeleteQtyOpen}
        isPending={isPendingUpdateCart}
        onConfirm={() => mutateUpdateCart({ cartId: cart?.id!, quantity: 0 })}
        onOpenChange={onOpenDeleteQtyChange}
        title={t('Messages.confirmDeleteTitle')}
        description={t('Messages.confirmDeleteDesc')}
      />

      <Card
        shadow='none'
        fullWidth
        className={cn(
          className,
          // '[&:not(:last-child)]:border-divider [&:not(:last-child)]:border-b',
        )}
        radius='none'
        {...props}
      >
        <CardBody>
          <div className='grid gap-10 xl:grid-cols-3'>
            <div
              className={cn(
                'border-divider relative aspect-square size-[250px] shrink-0 overflow-hidden rounded-lg border bg-white transition-all duration-1000 ease-in-out',
                // 'rounded-[60%_40%_30%_70%/60%_30%_70%_40%]',
              )}
            >
              <Image
                alt='product-image'
                className={cn(
                  'size-full object-contain p-10 transition-transform duration-1000',
                  'scale-100',
                )}
                classNames={{ wrapper: 'size-full' }}
                radius='none'
                src={cart?.product?.images?.[0]?.url ?? NO_IMAGE}
                width='100%'
              />
            </div>

            <div className='col-span-2 flex flex-col justify-between gap-3'>
              <div className='flex flex-col'>
                <span className='line-clamp-1 font-bold'>
                  {cart?.product?.name}
                </span>
                <span className='text-default-500'>
                  {t('Item.productId')}: {cart?.product?.id}
                </span>
                <div className='flex flex-wrap gap-2'>
                  <span className='text-default-500'>
                    {t('Item.price')}: {formatCurrency(currentPrice!)}/
                    {tUnit(productUnit?.toUpperCase())}
                  </span>
                  <span className='text-default-500'>
                    {t('Item.remaining')}: {formatNumber(currentStockQuantity!)}
                    /{tUnit(productUnit?.toUpperCase())}
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='flex flex-col gap-2 sm:flex-row'>
                  <NumberInput
                    disabled
                    isDisabled={isPendingUpdateCart}
                    label={t('Item.qtyLabel')}
                    maxValue={currentStockQuantity}
                    value={quantity}
                    variant='bordered'
                    onChange={onQuantityChange}
                  />

                  {cart?.product?.variants.length !== 0 && (
                    <Select
                      disallowEmptySelection
                      items={cart?.product?.variants || []}
                      label={t('Item.optionsLabel')}
                      placeholder={t('Item.optionsPlaceholder')}
                      selectedKeys={variantId ? [variantId] : []}
                      variant='bordered'
                      onSelectionChange={onVariantChange}
                    >
                      {(variant) => (
                        <SelectItem
                          key={variant?.id}
                          startContent={
                            <Avatar
                              src={variant?.image ?? '/images/no-image.jpg'}
                            />
                          }
                        >
                          {variant?.name}
                        </SelectItem>
                      )}
                    </Select>
                  )}
                </div>

                <Button
                  className='w-fit'
                  startContent={<TrashIcon />}
                  variant='faded'
                  onClick={onDeleteCart}
                />

                <span className='text-primary text-lg font-semibold sm:text-2xl'>
                  {formatCurrency(currentPrice! * quantity!, CURRENCY_OPTIONS)}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}
