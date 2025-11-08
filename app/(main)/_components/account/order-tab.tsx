import { Card, CardBody, CardHeader } from '@heroui/card'

import { OrderItem } from './_components/order-item'

const OrderTab = () => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>รายการคำสั่งซื้อของฉัน</span>
      </CardHeader>
      <CardBody className='gap-4'>
        <OrderItem />
        <OrderItem />
      </CardBody>
    </Card>
  )
}

export { OrderTab }
