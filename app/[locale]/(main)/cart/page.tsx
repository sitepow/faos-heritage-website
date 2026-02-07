'use client'

import Head from 'next/head'
// import { useTranslations } from 'next-intl'

// import { CartItem } from './_components/CartItem'
// import { CartSummaryCard } from './_components/CartSummaryCard'

// import { Container } from '@/components/layouts/Container'
// import { EmptyState } from '@/components/ui/EmptyState'
// import { useCarts } from '@/features/cart/useCart'
// import { useUser } from '@/hooks/useUser'

const CartPage = () => {
  // const t = useTranslations('cart')

  // const { userId } = useUser()
  // const { data: carts, isLoading: isLoadingCarts } = useCarts({ userId })

  // const isHasCarts = !isLoadingCarts && carts && carts?.length > 0
  // const isEmptyCarts = !isLoadingCarts && carts && carts?.length === 0

  return (
    <>
      <Head>
        <meta content='noindex, nofollow' name='robots' />
      </Head>

      {/* <Container className='flex flex-col gap-5 p-5'>
        <span className='text-xl font-semibold'>
          {t('title', { count: carts?.length || 0 })}
        </span>

        {isEmptyCarts && (
          <EmptyState
            color='default'
            description={t('empty')}
            variant='bordered'
          />
        )}

        {isHasCarts &&
          carts?.map((cart) => <CartItem key={cart?.id} cart={cart} />)}

        {isHasCarts && <CartSummaryCard />}
      </Container> */}
    </>
  )
}

export default CartPage
