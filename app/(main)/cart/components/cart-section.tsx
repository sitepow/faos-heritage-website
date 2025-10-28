import { Card, CardBody, CardHeader } from '@heroui/card'
import clsx from 'clsx'

import type { ComponentProps, FC } from 'react'

import { CartItem } from './cart-item'

const CartSection: FC<ComponentProps<typeof Card>> = ({
  className,
  ...props
}) => {
  return (
    <Card fullWidth className={clsx(className)} {...props}>
      <CardHeader>
        <span className='font-bold'>รายการสินค้า</span>
      </CardHeader>
      <CardBody>
        <CartItem />
      </CardBody>
    </Card>
  )
}

export { CartSection }
