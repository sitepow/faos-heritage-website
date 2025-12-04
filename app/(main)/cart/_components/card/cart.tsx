'use client'

import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/card'
import { TrashIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { useEffect, useState, type ComponentProps, type FC } from 'react'

import { ModalDelete } from '@/components/modal/delete'
import { createSlug } from '@/utils/helper'
import { formatCurrency } from '@/utils/number'
import { cn } from '@/utils/style'
import { useDisclosure } from '@heroui/modal'
import { NumberInput } from '@heroui/number-input'
import { Skeleton } from '@heroui/skeleton'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { updateCart, type GetCartsResult } from '../../actions/cart'
import { useCartStore } from '../../store'

const CartCard: FC<ComponentProps<typeof Card> & NonNullable<GetCartsResult>[number]> = ({
  className,
  id,
  product,
  quantity,
  ...props
}) => {
  const queryClient = useQueryClient()

  const [qty, setQty] = useState(quantity)
  const { data: session } = useSession()
  const userId = session?.user?.id

  const CART_QUERY_KEY = ['carts', userId]
  const CART_COUNT_QUERY_KEY = ['carts', 'count', userId]

  const { isOpen: isDeleteQtyOpen, onOpenChange: onOpenDeleteQtyChange } = useDisclosure()
  const { setState, onOpenDeleteChange } = useCartStore()

  const { mutate: mutateUpdateCart, isPending: isPendingUpdateCart } = useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CART_COUNT_QUERY_KEY })
    },
  })

  useEffect(() => {
    setQty(quantity)
  }, [quantity])

  useEffect(() => {
    if (qty === quantity) return

    const handler = setTimeout(() => {
      if (qty === 0) {
        onOpenDeleteQtyChange()

        return
      }

      mutateUpdateCart({ cartId: id!, quantity: Number(qty) })
    }, 500)

    return () => clearTimeout(handler)
  }, [id, mutateUpdateCart, onOpenDeleteQtyChange, qty, quantity])

  return (
    <>
      <ModalDelete
        isOpen={isDeleteQtyOpen}
        isPending={isPendingUpdateCart}
        onConfirm={() => {
          mutateUpdateCart({ cartId: id!, quantity: Number(qty) })
        }}
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
              <Link href={`/product/${createSlug(product?.name, product?.id)}`}>
                <Image
                  alt='product-image'
                  className='shrink-0 rounded-xl object-cover'
                  height={150}
                  src={product?.images?.[0]?.url ?? '/placeholder.svg'}
                  width={150}
                />
              </Link>

              <div className='flex max-w-96 flex-col justify-between gap-3'>
                <div className='flex flex-col'>
                  <span className='line-clamp-1'>{product?.name}</span>

                  <div className='flex flex-col flex-wrap text-default-500 sm:flex-row sm:gap-2'>
                    <span>รหัสสินค้า: {product?.id}</span>
                    <span>ราคา: {formatCurrency(product?.price)}/ชิ้น</span>
                  </div>
                </div>

                <div className='flex flex-wrap items-center gap-3'>
                  <NumberInput
                    className='w-fit'
                    value={qty}
                    onChange={(value) => {
                      const qty = Number(value)

                      if (qty > product.stockQuantity) {
                        setQty(product.stockQuantity)

                        return
                      }

                      if (qty === 0) {
                        onOpenDeleteQtyChange()

                        return
                      }

                      setQty(qty)
                    }}
                    maxValue={product.stockQuantity}
                    isDisabled={isPendingUpdateCart}
                    label='จำนวน'
                  />
                  <span className='text-lg font-bold text-primary-website sm:text-2xl'>
                    {formatCurrency(product?.price * qty)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className='w-full lg:w-fit'
              startContent={<TrashIcon className='text-default-500' />}
              onClick={() => {
                setState({ cartId: id })
                onOpenDeleteChange()
              }}
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
