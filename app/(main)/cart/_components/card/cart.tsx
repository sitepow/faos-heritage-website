'use client'

import { ModalDelete } from '@/components/modal/delete'
import { createSlug } from '@/utils/helper'
import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { useDisclosure } from '@heroui/modal'
import { NumberInput } from '@heroui/number-input'
import { Select, SelectItem } from '@heroui/select'
import { Skeleton } from '@heroui/skeleton'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState, type ComponentProps, type FC } from 'react'
import { updateCart, type GetCartsResult } from '../../actions/cart'
import { useCartStore } from '../../store'

const CartCard: FC<
  ComponentProps<typeof Card> & {
    cart: NonNullable<GetCartsResult>[number]
  }
> = ({ className, cart, ...props }) => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const { setState, onOpenDeleteChange } = useCartStore()

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null)

  useEffect(() => {
    if (cart?.variantId) {
      setSelectedVariantId(cart?.variantId)
    }
  }, [cart?.variantId])

  const [qty, setQty] = useState(cart?.quantity)

  const userId = session?.user?.id
  const PRODUCT_QUERY_KEY = ['product', cart?.product?.id]
  const CART_QUERY_KEY = ['carts', userId]
  const CART_COUNT_QUERY_KEY = ['carts', 'count', userId]

  const { isOpen: isDeleteQtyOpen, onOpenChange: onOpenDeleteQtyChange } = useDisclosure()

  const { mutate: mutateUpdateCart, isPending: isPendingUpdateCart } = useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: CART_COUNT_QUERY_KEY }),
      ])
    },
  })

  const currentVariant = useMemo(() => {
    return cart?.product?.variants?.find((variant) => variant?.id === selectedVariantId)
  }, [cart?.product?.variants, selectedVariantId])

  const price = currentVariant?.price ?? cart?.product?.price
  const stockQuantity = currentVariant?.stockQuantity ?? cart?.product?.stockQuantity

  useEffect(() => {
    setQty(cart?.quantity)
  }, [cart?.quantity])

  useEffect(() => {
    if (!cart?.id || qty === cart?.quantity) return

    const handler = setTimeout(() => {
      if (qty === 0) {
        onOpenDeleteQtyChange()

        return
      }

      mutateUpdateCart({ cartId: cart.id, quantity: Number(qty), variantId: selectedVariantId! })
    }, 500)

    return () => clearTimeout(handler)
  }, [cart.id, mutateUpdateCart, onOpenDeleteQtyChange, qty, cart?.quantity, selectedVariantId])

  const handleQuantityChange = (value: unknown) => {
    const newQty = Number(value)

    if (newQty > stockQuantity) {
      setQty(stockQuantity)

      return
    }

    if (newQty === 0) {
      onOpenDeleteQtyChange()

      return
    }

    setQty(newQty)
  }

  const handleVariantChange = (keys: Iterable<unknown> | ArrayLike<unknown>) => {
    const selected = Array.from(keys)[0]
    const newVariantId = String(selected)

    setSelectedVariantId(newVariantId)
    if (cart?.id && qty) {
      mutateUpdateCart({
        cartId: cart.id,
        quantity: Number(qty),
        variantId: newVariantId!,
      })
    }
  }

  const handleModalDeleteConfirm = () => {
    mutateUpdateCart({ cartId: cart?.id!, quantity: 0 })
  }

  const handleTrashClick = () => {
    setState({ cartId: cart?.id })
    onOpenDeleteChange()
  }

  return (
    <>
      <ModalDelete
        isOpen={isDeleteQtyOpen}
        isPending={isPendingUpdateCart}
        onConfirm={handleModalDeleteConfirm}
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
          <div className='flex flex-wrap items-center justify-start gap-4 lg:flex-nowrap lg:justify-around'>
            <div className='flex flex-wrap gap-5 sm:flex-nowrap'>
              <Link
                href={`/product/${createSlug(cart?.product?.name, cart?.product?.id)}`}
                className='shrink-0'
              >
                <Image
                  alt='product-image'
                  className='shrink-0 rounded-xl object-cover'
                  height={150}
                  src={cart?.product?.images?.[0]?.url ?? '/placeholder.svg'}
                  width={150}
                />
              </Link>

              <div className='flex max-w-96 flex-col justify-between gap-3'>
                <div className='flex flex-col'>
                  <span className='line-clamp-1'>{cart?.product?.name}</span>

                  <div className='flex flex-col flex-wrap text-default-500 sm:flex-row sm:gap-2'>
                    <span>รหัสสินค้า: {cart?.product?.id}</span>
                    <span>ราคา: {formatCurrency(price!)}/ชิ้น</span>
                  </div>
                </div>

                <div className='flex flex-col gap-3'>
                  <NumberInput
                    variant='faded'
                    value={qty}
                    onChange={handleQuantityChange}
                    maxValue={stockQuantity}
                    isDisabled={isPendingUpdateCart}
                    label='จำนวน'
                  />

                  {cart?.product?.variants?.length !== 0 && (
                    <Select
                      variant='faded'
                      label='ตัวเลือกสินค้า'
                      placeholder='เลือกตัวเลือกสินค้า'
                      items={cart?.product?.variants || []}
                      selectedKeys={selectedVariantId ? [selectedVariantId] : []}
                      onSelectionChange={handleVariantChange}
                    >
                      {(variant) => <SelectItem key={variant?.id}>{variant?.name}</SelectItem>}
                    </Select>
                  )}

                  <span className='text-lg font-bold text-primary-website sm:text-2xl'>
                    {formatCurrency(price! * qty!)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className='w-full lg:w-fit'
              startContent={<TrashIcon className='text-default-500' />}
              onClick={handleTrashClick}
              variant='faded'
            />
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
