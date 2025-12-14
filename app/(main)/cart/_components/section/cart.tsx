'use client'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, type ComponentProps, type FC } from 'react'

import { getCarts } from '../../actions/cart'
import { useCartStore } from '../../store'
import { CartCard, CartCardSkeleton } from '../card/cart'

import { cn } from '@/utils/style'

const CartSection: FC<ComponentProps<typeof Card>> = ({
  className,
  ...props
}) => {
  const { setState } = useCartStore()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY = {
    CART: ['carts', userId],
  }

  const { data: carts, isLoading: isLoadingCarts } = useQuery({
    queryKey: QUERY.CART,
    queryFn: () => getCarts(userId!),
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
        <b>Product list</b>
      </CardHeader>
      <CardBody className='flex-col gap-4'>
        {isLoadingCarts &&
          [...Array(1)].map((_) => <CartCardSkeleton key={_} />)}

        {!isLoadingCarts && carts?.length === 0 && (
          <div className='flex size-full flex-col items-center justify-center gap-2 text-default-500'>
            <AlertCircleIcon />
            <span className='text-center'>
              There are no items in your cart You can browse products on the
              homepage
              <br />
              Then add the items to your cart to proceed
            </span>
          </div>
        )}

        {!isLoadingCarts &&
          carts?.length !== 0 &&
          carts?.map((cart) => <CartCard key={cart?.id} cart={cart} />)}
      </CardBody>
    </Card>
  )
}

export { CartSection }
