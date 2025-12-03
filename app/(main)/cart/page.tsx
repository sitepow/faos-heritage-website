'use client'

import { ModalDelete } from '@/components/modal/delete'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { CartSection } from './_components/section/cart'
import { OrderSection } from './_components/section/order'
import { deleteCart } from './actions/cart'
import { useCartStore } from './store'

const Cart = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const user = session?.user

  const { carts, setState, cartId, onOpenDeleteChange, isDeleteOpen } = useCartStore()

  const { mutate: mutateDeteleUser, isPending: isPendingDeteleUser } = useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carts', user?.id] })
      onOpenDeleteChange()
      setState({ cartId: null })
    },
  })

  return (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>

      <section className='flex flex-col items-center justify-center gap-4 text-center'>
        <ModalDelete
          isOpen={isDeleteOpen}
          isPending={isPendingDeteleUser}
          onConfirm={() => {
            mutateDeteleUser(cartId!)
          }}
          onOpenChange={onOpenDeleteChange}
        />

        <div className='flex w-full flex-wrap justify-between gap-2 text-start'>
          <span className='text-xl font-bold'>
            ตระกร้าของคุณ {carts?.length !== 0 && `(${carts?.length} ชิ้น)`}
          </span>
          <span className='text-default-500'>หมายเลขตระกร้าสินค้า {user?.id}</span>
        </div>

        <div className='grid w-full gap-5 lg:grid-cols-3'>
          <CartSection className='lg:col-span-2' />
          <OrderSection />
        </div>
      </section>
    </>
  )
}

export default Cart
