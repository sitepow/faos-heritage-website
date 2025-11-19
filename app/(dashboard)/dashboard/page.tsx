'use client'

import { Card, CardBody, CardHeader } from '@heroui/react'

import type { ComponentProps } from 'react'

import { CustomerItem } from '../_components/customer-item'
import { OrderItem } from '../_components/order-item'
import { ProductItem } from '../_components/product-item'

import { TrendCard } from '@/app/(dashboard)/_components/chart/trend-card'

const mockDashboardData: ComponentProps<typeof TrendCard>[] = [
  {
    title: 'รายได้รวม',
    value: 520234,
    isCurrency: true,
  },
  {
    title: 'ยอดขายวันนี้',
    value: 43002,
    isCurrency: true,
  },
  {
    title: 'ลูกค้าใหม่',
    value: 127,
  },
  {
    title: 'Transaction สำเร็จ',
    value: 456,
  },
  {
    title: 'ยอดขายเฉลี่ย',
    value: 624,
    isCurrency: true,
  },
  {
    title: 'Refund Rate (%)',
    value: 2.8,
  },
]

const DashboardHome = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {mockDashboardData.map((data) => (
          <TrendCard key={data.title} {...data} />
        ))}
      </div>

      <div className='grid w-full grid-cols-2 gap-5'>
        <Card>
          <CardHeader className='justify-between'>
            <span className='font-bold'>ออเดอร์ใหม่ (5 รายการล่าสุด)</span>
            <span className='text-default-500'>ดูเพิ่มเติม</span>
          </CardHeader>
          <CardBody>
            <OrderItem />
            <OrderItem />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className='justify-between'>
            <span className='font-bold'>ลูกค้าใหม่ (5 รายการล่าสุด)</span>
            <span className='text-default-500'>ดูเพิ่มเติม</span>
          </CardHeader>
          <CardBody>
            <CustomerItem />
            <CustomerItem />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className='justify-between'>
            <span className='font-bold'>สินค้าขายดี (5 รายการล่าสุด)</span>
            <span className='text-default-500'>ดูเพิ่มเติม</span>
          </CardHeader>
          <CardBody>
            <ProductItem />
            <ProductItem />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className='justify-between'>
            <span className='font-bold'>สต็อกกำลังหมด (5 รายการล่าสุด)</span>
            <span className='text-default-500'>ดูเพิ่มเติม</span>
          </CardHeader>
          <CardBody>
            <ProductItem />
            <ProductItem />
          </CardBody>
        </Card>
      </div>
    </section>
  )
}

export default DashboardHome
