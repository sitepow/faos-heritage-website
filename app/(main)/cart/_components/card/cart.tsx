'use client'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { useDisclosure } from '@heroui/modal'
import { NumberInput } from '@heroui/number-input'
import { Select, SelectItem } from '@heroui/select'
import { Skeleton } from '@heroui/skeleton'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type FC,
} from 'react'

import type { GetCartResult } from '../../actions/cart'

import { updateCart } from '../../actions/cart'
import { useCartStore } from '../../store'

import { ModalConfirm } from '@/components/modal/confirm'
import { createSlug, getProductUnit } from '@/utils/helper'
import { formatCurrency, formatNumber } from '@/utils/number'
import { cn } from '@/utils/style'

const CartCard: FC<
  ComponentProps<typeof Card> & {
    cart: GetCartResult
  }
> = ({ className, cart, ...props }) => {
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

  const QUERY = {
    PRODUCT: ['product', cart?.product?.id],
    CART: ['carts', userId],
    CART_COUNT: ['carts', 'count', userId],
  }

  const { mutate: mutateUpdateCart, isPending: isPendingUpdateCart } =
    useMutation({
      mutationFn: updateCart,
      onSuccess: () => {
        Promise.all([
          queryClient.invalidateQueries({ queryKey: QUERY.PRODUCT }),
          queryClient.invalidateQueries({ queryKey: QUERY.CART }),
          queryClient.invalidateQueries({ queryKey: QUERY.CART_COUNT }),
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
      <ModalConfirm
        isOpen={isDeleteQtyOpen}
        isPending={isPendingUpdateCart}
        onConfirm={() => mutateUpdateCart({ cartId: cart?.id!, quantity: 0 })}
        onOpenChange={onOpenDeleteQtyChange}
      />

      <Card
        fullWidth
        className={cn(
          className,
          '[&:not(:last-child)]:border-b [&:not(:last-child)]:border-divider',
        )}
        radius='none'
        shadow='none'
        {...props}
      >
        <CardBody>
          <div className='grid gap-4 sm:grid-cols-3'>
            <div className='flex size-full sm:items-center sm:justify-center'>
              <Link
                className='size-[150px] shrink-0 border border-divider'
                href={`/product/${createSlug(cart?.product?.name, cart?.product?.id)}`}
              >
                <Image
                  alt='product-image'
                  className='aspect-square size-full object-cover'
                  height={100}
                  src={cart?.product?.images?.[0]?.url ?? '/no-image.png'}
                  width={100}
                />
              </Link>
            </div>

            <div className='col-span-2 flex flex-col justify-between gap-3'>
              <div className='flex flex-col'>
                <span className='line-clamp-1'>{cart?.product?.name}</span>
                <span className='text-default-500'>
                  Product code: {cart?.product?.id}
                </span>
                <div className='flex flex-wrap gap-2'>
                  <span className='text-default-500'>
                    Price: {formatCurrency(currentPrice!)}/{productUnit}
                  </span>
                  <span className='text-default-500'>
                    Remaining quantity: {formatNumber(currentStockQuantity!)}/
                    {productUnit}
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <NumberInput
                  disabled
                  isDisabled={isPendingUpdateCart}
                  label='Quantity'
                  maxValue={currentStockQuantity}
                  value={quantity}
                  variant='bordered'
                  onChange={onQuantityChange}
                />

                {cart?.product?.variants.length !== 0 && (
                  <Select
                    disallowEmptySelection
                    items={cart?.product?.variants || []}
                    label='Product options'
                    placeholder='Select product options'
                    selectedKeys={variantId ? [variantId] : []}
                    variant='bordered'
                    onSelectionChange={onVariantChange}
                  >
                    {(variant) => (
                      <SelectItem key={variant?.id}>{variant?.name}</SelectItem>
                    )}
                  </Select>
                )}

                <Button
                  className='w-fit bg-white text-primary dark:bg-divider'
                  color='primary'
                  startContent={<TrashIcon className='text-primary' />}
                  variant='bordered'
                  onClick={onDeleteCart}
                />

                <span className='text-lg font-bold text-primary sm:text-2xl'>
                  {formatCurrency(currentPrice! * quantity!)}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

const CartCardSkeleton = () => {
  return <Skeleton className='h-48 w-full rounded-xl' />
}

export { CartCard, CartCardSkeleton }
