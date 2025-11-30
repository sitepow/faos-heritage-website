import { Card, CardBody, CardHeader } from '@heroui/card'

import type { ComponentProps, FC } from 'react'

import { CartCard } from '../card/cart'

import { cn } from '@/utils/style'

const CartSection: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  return (
    <Card fullWidth className={cn(className)} {...props}>
      <CardHeader>
        <b>รายการสินค้า</b>
      </CardHeader>
      <CardBody>
        <CartCard />
        <CartCard />
        <CartCard />
        <CartCard />
      </CardBody>
    </Card>
  )
}

export { CartSection }
