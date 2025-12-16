'use client'

import { Button } from '@heroui/button'
import { useDisclosure } from '@heroui/modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'

import { CartSection } from './_components/section/cart'
import { OrderSection } from './_components/section/order'
import { clearCart, deleteCart } from './actions/cart'
import { useCartStore } from './store'

import { ModalConfirm } from '@/components/modal/confirm'

const Cart = () => {
  const queryClient = useQueryClient()
  const { carts, setState, cartId, onOpenDeleteChange, isDeleteOpen } =
    useCartStore()
  const { isOpen: isClearOpen, onOpenChange: onOpenClearChange } =
    useDisclosure()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY = {
    CART: ['carts', userId],
    CART_COUNT: ['carts', 'count', userId],
  }

  const { mutate: mutateDeteleCart, isPending: isPendingDeteleCart } =
    useMutation({
      mutationFn: deleteCart,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY.CART })
        queryClient.invalidateQueries({ queryKey: QUERY.CART_COUNT })
        setState({ cartId: null })
        onOpenDeleteChange()
      },
    })

  const { mutate: mutateClearCarts, isPending: isPendingClearCarts } =
    useMutation({
      mutationFn: clearCart,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY.CART })
        queryClient.invalidateQueries({ queryKey: QUERY.CART_COUNT })
        onOpenClearChange()
      },
    })

  const isPending = isPendingClearCarts || isPendingDeteleCart

  return (
    <>
      <Head>
        <meta content='noindex, nofollow' name='robots' />
      </Head>

      <section className='flex flex-col items-center justify-center gap-4 text-center'>
        <ModalConfirm
          isOpen={isDeleteOpen}
          isPending={isPending}
          onConfirm={() => {
            mutateDeteleCart(cartId!)
          }}
          onOpenChange={onOpenDeleteChange}
        />

        <ModalConfirm
          isOpen={isClearOpen}
          isPending={isPending}
          onConfirm={() => {
            mutateClearCarts(userId!)
          }}
          onOpenChange={onOpenClearChange}
        />
        <div className='flex w-full flex-wrap justify-between gap-2 text-start'>
          <span className='text-xl font-bold'>
            Your basket {carts?.length !== 0 && `(${carts?.length} list)`}
          </span>
          <span className='text-default-500'>
            Shopping cart number {userId}
          </span>
        </div>

        {carts?.length !== 0 && (
          <div className='flex w-full flex-wrap justify-end gap-2'>
            <Button
              className='bg-white text-primary dark:bg-divider'
              color='primary'
              startContent={<XIcon className='text-primary' />}
              variant='bordered'
              onClick={() => onOpenClearChange()}
            >
              Empty all baskets
            </Button>
          </div>
        )}

        <div className='grid w-full gap-5 lg:grid-cols-3'>
          <CartSection className='lg:col-span-2' />
          <OrderSection />
        </div>
      </section>
    </>
  )
}

export default Cart
