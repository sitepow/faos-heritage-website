import { Card, CardBody, CardHeader } from '@heroui/card'

import type { ComponentProps } from 'react'

import { CustomerItem } from '../_components/customer-item'
import { OrderItem } from '../_components/order-item'
import { ProductItem } from '../_components/product-item'

import { TrendCard } from '@/app/(dashboard)/_components/chart/trend-card'

const MOCKUP_DASHBOARD_CONST: ComponentProps<typeof TrendCard>[] = [
  {
    name: 'รายได้รวม',
    value: 520234,
    isCurrency: true,
  },
  {
    name: 'ยอดขายวันนี้',
    value: 43002,
    isCurrency: true,
  },
  {
    name: 'ลูกค้าใหม่',
    value: 127,
  },
  {
    name: 'Transaction สำเร็จ',
    value: 456,
  },
  {
    name: 'ยอดขายเฉลี่ย',
    value: 624,
    isCurrency: true,
  },
  {
    name: 'Refund Rate (%)',
    value: 2.8,
  },
]

const DashboardHome = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {MOCKUP_DASHBOARD_CONST.map((data) => (
          <TrendCard key={data.name} {...data} />
        ))}
      </div>

      <div className='grid w-full gap-5 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <b>ออเดอร์ใหม่</b>
          </CardHeader>
          <CardBody>
            <OrderItem />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <b>ลูกค้าใหม่</b>
          </CardHeader>
          <CardBody>
            <CustomerItem />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <b>สินค้าขายดี</b>
          </CardHeader>
          <CardBody>
            <ProductItem />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <b>สต็อกกำลังหมด</b>
          </CardHeader>
          <CardBody>
            <ProductItem />
          </CardBody>
        </Card>
      </div>
    </section>
  )
}

export default DashboardHome
