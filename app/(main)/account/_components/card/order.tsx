import { Card, CardBody, CardHeader } from '@heroui/card'

import { Order } from '../order'

const OrderCard = () => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>รายการคำสั่งซื้อของฉัน</span>
      </CardHeader>
      <CardBody className='gap-4'>
        <Order />
        <Order />
      </CardBody>
    </Card>
  )
}

export { OrderCard }
