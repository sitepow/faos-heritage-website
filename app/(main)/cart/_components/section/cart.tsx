'use client'

import { Card, CardBody, CardHeader } from '@heroui/card'

import type { ComponentProps, FC } from 'react'

import { CartCard, CartCardSkeleton } from '../card/cart'

import { cn } from '@/utils/style'
import { AlertCircleIcon } from 'lucide-react'
import { useCartStore } from '../../store'

const CartSection: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  const { carts, isLoading } = useCartStore()

  return (
    <Card fullWidth className={cn(className)} {...props}>
      <CardHeader>
        <b>รายการสินค้า</b>
      </CardHeader>
      <CardBody className='flex-col gap-4'>
        {isLoading && [...Array(1)].map((_, index) => <CartCardSkeleton key={index} />)}

        {!isLoading && carts?.length === 0 && (
          <div className='flex size-full flex-col items-center justify-center gap-2 text-default-500'>
            <AlertCircleIcon />
            <span>ไม่มีสินค้าในตระกร้า</span>
          </div>
        )}

        {!isLoading &&
          carts?.length !== 0 &&
          carts?.map((cart) => <CartCard key={cart?.id} {...cart} />)}
      </CardBody>
    </Card>
  )
}

export { CartSection }
