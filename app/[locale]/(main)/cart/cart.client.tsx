'use client'

import { Button } from '@heroui/react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { CartItem } from './_components/CartItem'
import { CartSummaryCard } from './_components/CartSummaryCard'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCarts } from '@/features/cart/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'

const CartClient = () => {
  const t = useTranslations('cart')
  const locale = useLocale()

  const { userId } = useAuth()
  const { data: carts, isLoading: isLoadingCarts } = useCarts({
    userId,
    locale,
  })

  const isHasCarts = !isLoadingCarts && carts && carts?.length > 0
  const isEmptyCarts = !isLoadingCarts && carts && carts?.length === 0

  return (
    <AppSection>
      <Container className='flex flex-col gap-5'>
        <span className='text-xl font-semibold'>
          {t('title', { count: carts?.length || 0 })}
        </span>

        {!userId ? (
          <EmptyState
            color='default'
            description='กรุณาเข้าสู่ระบบเพื่อดูสินค้าในตะกร้าของคุณ'
          >
            <div className='mt-3 flex justify-center'>
              <Button
                as={Link}
                color='primary'
                href={`/login?callbackUrl=/${locale}/cart`}
                size='sm'
              >
                เข้าสู่ระบบ
              </Button>
            </div>
          </EmptyState>
        ) : (
          <>
            {isEmptyCarts && <EmptyState description={t('empty')} />}

            {isHasCarts &&
              carts?.map((cart) => <CartItem key={cart?.id} cart={cart} />)}

            {isHasCarts && <CartSummaryCard />}
          </>
        )}
      </Container>
    </AppSection>
  )
}

export { CartClient }
