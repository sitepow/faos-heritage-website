'use client'

import { Button, useDisclosure } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { clearCart, deleteCart } from './action'
import { useCartStore } from './store'

import { ConfirmModal } from '@/components/ui/ConfirmModal'

export default function Cart() {
  const t = useTranslations('Cart')
  const queryClient = useQueryClient()
  const { carts, setState, cartId, onOpenDeleteChange, isDeleteOpen } =
    useCartStore()
  const { isOpen: isClearOpen, onOpenChange: onOpenClearChange } =
    useDisclosure()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY_KEY = {
    CART: ['carts', userId],
    CART_COUNT: ['carts', 'stat', userId],
  }

  const { mutate: mutateDeteleCart, isPending: isPendingDeteleCart } =
    useMutation({
      mutationFn: deleteCart,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.CART })
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.CART_COUNT })
        setState({ cartId: null })
        onOpenDeleteChange()
      },
    })

  const { mutate: mutateClearCarts, isPending: isPendingClearCarts } =
    useMutation({
      mutationFn: clearCart,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.CART })
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.CART_COUNT })
        onOpenClearChange()
      },
    })

  const isPending = isPendingClearCarts || isPendingDeteleCart

  return (
    <>
      <Head>
        <meta content='noindex, nofollow' name='robots' />
      </Head>

      <section className='container mx-auto flex flex-col items-center justify-center gap-4 p-5 text-center'>
        <ConfirmModal
          description={t('Messages.confirmDeleteDesc')}
          isOpen={isDeleteOpen}
          isPending={isPending}
          title={t('Messages.confirmDeleteTitle')}
          onConfirm={() => {
            mutateDeteleCart(cartId!)
          }}
          onOpenChange={onOpenDeleteChange}
        />

        <ConfirmModal
          description={t('Messages.confirmClearDesc')}
          isOpen={isClearOpen}
          isPending={isPending}
          title={t('Messages.confirmClearTitle')}
          onConfirm={() => {
            mutateClearCarts(userId!)
          }}
          onOpenChange={onOpenClearChange}
        />

        <div className='flex w-full flex-wrap justify-between gap-2 text-start'>
          <span className='text-xl font-semibold'>
            {t('Page.title', {
              count: carts?.length,
            })}
          </span>
          <span className='text-default-500'>
            {t('Page.cartId')}: {userId}
          </span>
        </div>

        {carts && carts.length !== 0 && (
          <div className='flex w-full flex-wrap justify-end gap-2'>
            <Button
              startContent={<XIcon />}
              variant='bordered'
              onClick={() => onOpenClearChange()}
            >
              {t('Page.clearBtn')}
            </Button>
          </div>
        )}

        <div className='grid w-full items-start gap-2 md:gap-4 lg:grid-cols-3'>
          {/* <CartLists className='lg:col-span-2' /> */}
          {/* <div className='lg:sticky lg:top-20'>
            <CartCheckout />
          </div> */}
        </div>
      </section>
    </>
  )
}
