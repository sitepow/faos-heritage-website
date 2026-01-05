/* eslint-disable react/no-unstable-nested-components */
'use client'

import { Card, CardBody, CardHeader } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, type ComponentProps } from 'react'

import {
  CartItem,
  CartItemSkeleton,
} from '@/app/[locale]/(main)/cart/_components/item'
import { getCarts } from '@/app/[locale]/(main)/cart/action'
import { useCartStore } from '@/app/[locale]/(main)/cart/store'
import { cn } from '@/utils/style'

type CartListsProp = ComponentProps<typeof Card>

export const CartLists = ({ className, ...props }: CartListsProp) => {
  const t = useTranslations('Cart')
  const { setState } = useCartStore()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY_KEY = {
    CART: ['carts', userId],
  }

  const { data: carts, isLoading: isLoadingCarts } = useQuery({
    queryKey: QUERY_KEY.CART,
    queryFn: async () => getCarts(userId!),
    enabled: !!userId,
  })

  useEffect(() => {
    if (carts) {
      setState({ carts })
    }
  }, [carts, setState])

  return (
    <Card fullWidth className={cn(className)} {...props}>
      <CardHeader>
        <b>{t('List.header')}</b>
      </CardHeader>
      <CardBody className='flex-col gap-4'>
        {isLoadingCarts &&
          [...Array(1)].map((_, index) => <CartItemSkeleton key={index} />)}

        {!isLoadingCarts && carts?.length === 0 && (
          <div className='text-default-500 flex size-full flex-col items-center justify-center gap-2'>
            <AlertCircleIcon />
            <span className='text-center'>
              {t.rich('List.emptyCart', {
                br: () => <br />,
              })}
            </span>
          </div>
        )}

        {!isLoadingCarts &&
          carts?.length !== 0 &&
          carts?.map((cart) => <CartItem key={cart?.id} cart={cart} />)}
      </CardBody>
    </Card>
  )
}
