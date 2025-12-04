'use client'

import { ModalDelete } from '@/components/modal/delete'
import { Button } from '@heroui/button'
import { useDisclosure } from '@heroui/modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { CartSection } from './_components/section/cart'
import { OrderSection } from './_components/section/order'
import { clearCart, deleteCart } from './actions/cart'
import { useCartStore } from './store'

const Cart = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const CART_QUERY_KEY = ['carts', userId]
  const CART_COUNT_QUERY_KEY = ['carts', 'count', userId]

  const { carts, setState, cartId, onOpenDeleteChange, isDeleteOpen } = useCartStore()
  const { isOpen: isClearOpen, onOpenChange: onOpenClearChange } = useDisclosure()

  const { mutate: mutateDeteleCart, isPending: isPendingDeteleCart } = useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CART_COUNT_QUERY_KEY })
      onOpenDeleteChange()
      setState({ cartId: null })
    },
  })

  const { mutate: mutateClearCarts, isPending: isPendingClearCarts } = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CART_COUNT_QUERY_KEY })
      onOpenClearChange()
    },
  })

  const isPending = isPendingClearCarts || isPendingDeteleCart

  return (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>

      <section className='flex flex-col items-center justify-center gap-4 text-center'>
        <ModalDelete
          isOpen={isDeleteOpen}
          isPending={isPending}
          onConfirm={() => {
            mutateDeteleCart(cartId!)
          }}
          onOpenChange={onOpenDeleteChange}
        />

        <ModalDelete
          isOpen={isClearOpen}
          isPending={isPending}
          onConfirm={() => {
            mutateClearCarts(userId!)
          }}
          onOpenChange={onOpenClearChange}
        />
        <div className='flex w-full flex-wrap justify-between gap-2 text-start'>
          <span className='text-xl font-bold'>
            ตระกร้าของคุณ {carts?.length !== 0 && `(${carts?.length} ชิ้น)`}
          </span>
          <span className='text-default-500'>หมายเลขตระกร้าสินค้า {userId}</span>
        </div>

        {carts?.length !== 0 && (
          <div className='flex w-full flex-wrap justify-end gap-2'>
            <Button
              variant='faded'
              startContent={<XIcon className='text-default-500' />}
              onClick={() => onOpenClearChange()}
            >
              ล้างตระกร้าทั้งหมด
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
