'use client'

import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

import { CartItem } from './_components/CartItem'
import { CartSummaryCard } from './_components/CartSummaryCard'

import { EmptyState } from '@/components/ui/EmptyState'
import { useCarts } from '@/features/cart/useCart'

export default function Cart() {
  const translateCart = useTranslations('cart')

  const userId = useSession()?.data?.user?.id
  const { data: carts, isLoading: isLoadingCarts } = useCarts({ userId })
  const isHasCarts = !isLoadingCarts && carts && carts?.length > 0
  const isEmptyCarts = !isLoadingCarts && carts && carts?.length === 0

  return (
    <>
      <Head>
        <meta content='noindex, nofollow' name='robots' />
      </Head>

      <section className='container mx-auto flex flex-col gap-10 p-5'>
        <span className='text-xl font-semibold'>
          {translateCart('title', { count: carts?.length || 0 })}
        </span>

        {isEmptyCarts && (
          <EmptyState
            color='default'
            description={translateCart('empty')}
            variant='bordered'
          />
        )}

        {isHasCarts &&
          carts?.map((cart) => <CartItem key={cart?.id} cart={cart} />)}

        {isHasCarts && <CartSummaryCard />}
      </section>
    </>
  )
}
