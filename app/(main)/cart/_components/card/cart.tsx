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
  const init = {
    cartId: cart?.id,
    variantId: cart?.variantId,
    price: cart?.product?.price,
    variants: cart?.product?.variants,
    unit: cart?.product?.unit,
    stockQuantity: cart?.product?.stockQuantity,
    quantity: cart?.quantity,
    productId: cart?.product?.id,
    productName: cart?.product?.name,
    productImages: cart?.product?.images,
  }
  const productUnit = getProductUnit(init.unit)

  useEffect(() => {
    if (init.variantId) {
      setVariantId(init.variantId)
    }
  }, [init.variantId])

  const QUERY = {
    PRODUCT: ['product', init.productId],
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
    return init.variants?.find((variant) => variant?.id === variantId)
  }, [init.variants, variantId])

  const currentPrice = currentVariant?.price ?? init.price
  const currentStockQuantity =
    currentVariant?.stockQuantity ?? init.stockQuantity

  useEffect(() => {
    setQuantity(init.quantity)
  }, [init.quantity])

  useEffect(() => {
    if (!init.cartId || quantity === init.quantity) return

    const handler = setTimeout(() => {
      if (quantity === 0) {
        onOpenDeleteQtyChange()

        return
      }

      mutateUpdateCart({
        cartId: init.cartId,
        quantity: Number(quantity),
        variantId: variantId!,
      })
    }, 500)

    return () => clearTimeout(handler)
  }, [
    init.cartId,
    mutateUpdateCart,
    onOpenDeleteQtyChange,
    quantity,
    init.quantity,
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
    if (init.cartId && quantity) {
      mutateUpdateCart({
        cartId: init.cartId,
        quantity: Number(quantity),
        variantId: variantId!,
      })
    }
  }

  const onDeleteCart = () => {
    setState({ cartId: init.cartId })
    onOpenDeleteChange()
  }

  return (
    <>
      <ModalConfirm
        isOpen={isDeleteQtyOpen}
        isPending={isPendingUpdateCart}
        onConfirm={() =>
          mutateUpdateCart({ cartId: init.cartId!, quantity: 0 })
        }
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
                href={`/product/${createSlug(init?.productName, init?.productId)}`}
              >
                <Image
                  alt='product-image'
                  className='size-full shrink-0 object-cover'
                  height={150}
                  src={init?.productImages?.[0]?.url ?? '/placeholder.svg'}
                  width={150}
                />
              </Link>
            </div>

            <div className='col-span-2 flex flex-col justify-between gap-3'>
              <div className='flex flex-col'>
                <span className='line-clamp-1'>{init?.productName}</span>
                <span className='text-default-500'>
                  รหัสสินค้า: {init?.productId}
                </span>
                <div className='flex flex-wrap gap-2'>
                  <span className='text-default-500'>
                    ราคา: {formatCurrency(currentPrice!)}/{productUnit}
                  </span>
                  <span className='text-default-500'>
                    จำนวนคงเหลือ: {formatNumber(currentStockQuantity!)}/
                    {productUnit}
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <NumberInput
                  disabled
                  isDisabled={isPendingUpdateCart}
                  label='จำนวน'
                  maxValue={currentStockQuantity}
                  value={quantity}
                  variant='bordered'
                  onChange={onQuantityChange}
                />

                {init.variants.length !== 0 && (
                  <Select
                    disallowEmptySelection
                    items={init.variants || []}
                    label='ตัวเลือกสินค้า'
                    placeholder='เลือกตัวเลือกสินค้า'
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
                  className='w-fit'
                  startContent={<TrashIcon className='text-default-500' />}
                  variant='faded'
                  onClick={onDeleteCart}
                />

                <span className='text-lg font-bold text-primary-website sm:text-2xl'>
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
