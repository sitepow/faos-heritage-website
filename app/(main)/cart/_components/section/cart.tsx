'use client'

import { Card, CardBody, CardHeader } from '@heroui/card'

import { useEffect, type ComponentProps, type FC } from 'react'

import { CartCard, CartCardSkeleton } from '../card/cart'

import { cn } from '@/utils/style'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { getCarts } from '../../actions/cart'
import { useCartStore } from '../../store'

const CartSection: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  const { setState } = useCartStore()

  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data: carts, isLoading: isLoadingCarts } = useQuery({
    queryKey: ['carts', userId],
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
        <b>รายการสินค้า</b>
      </CardHeader>
      <CardBody className='flex-col gap-4'>
        {isLoadingCarts && [...Array(1)].map((_, index) => <CartCardSkeleton key={index} />)}

        {!isLoadingCarts && carts?.length === 0 && (
          <div className='flex size-full flex-col items-center justify-center gap-2 text-default-500'>
            <AlertCircleIcon />
            <span className='text-center'>
              ไม่มีสินค้าในตระกร้า คุณสามารถเลือกชมสินค้าได้ที่หน้าหลัก
              <br />
              แล้วเพิ่มสินค้าเข้าตระกร้าเพื่อดำเนินการต่อ
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
