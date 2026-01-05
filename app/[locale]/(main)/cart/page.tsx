'use client'

import { Button, useDisclosure } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { XIcon } from 'lucide-react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { CartCheckout } from './_components/checkout'
import { CartLists } from './_components/lists'
import { clearCart, deleteCart } from './action'
import { useCartStore } from './store'

import { ConfirmModal } from '@/components/modal/confirm'

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
    CART_COUNT: ['carts', 'count', userId],
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

      <section className='flex flex-col items-center justify-center gap-4 text-center'>
        <ConfirmModal
          isOpen={isDeleteOpen}
          isPending={isPending}
          title={t('Messages.confirmDeleteTitle')}
          description={t('Messages.confirmDeleteDesc')}
          onConfirm={() => {
            mutateDeteleCart(cartId!)
          }}
          onOpenChange={onOpenDeleteChange}
        />

        <ConfirmModal
          isOpen={isClearOpen}
          isPending={isPending}
          title={t('Messages.confirmClearTitle')}
          description={t('Messages.confirmClearDesc')}
          onConfirm={() => {
            mutateClearCarts(userId!)
          }}
          onOpenChange={onOpenClearChange}
        />

        <div className='flex w-full flex-wrap justify-between gap-2 text-start'>
          <span className='text-xl font-bold'>
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
              className='text-secondary'
              color='primary'
              startContent={<XIcon />}
              onClick={() => onOpenClearChange()}
            >
              {t('Page.clearBtn')}
            </Button>
          </div>
        )}

        <div className='grid w-full gap-5 lg:grid-cols-3'>
          <CartLists className='lg:col-span-2' />
          <CartCheckout />
        </div>
      </section>
    </>
  )
}
