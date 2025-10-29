'use client'

import { Card, CardHeader, Divider } from '@heroui/react'

import type { ComponentProps } from 'react'

import { TrendCard } from '@/components/chart/trend-card'

const mockDashboardData: ComponentProps<typeof TrendCard>[] = [
  {
    title: 'รายได้รวม',
    value: '฿284,500',
    change: '+12.5%',
    changeType: 'positive',
    trendType: 'up',
  },
  {
    title: 'ยอดขายวันนี้',
    value: '฿18,250',
    change: '+8.2%',
    changeType: 'positive',
    trendType: 'up',
  },
  {
    title: 'ลูกค้าใหม่',
    value: '127',
    change: '+33%',
    changeType: 'positive',
    trendType: 'up',
  },
  {
    title: 'Transaction สำเร็จ',
    value: '456',
    change: '+15.3%',
    changeType: 'positive',
    trendType: 'up',
  },
  {
    title: 'ยอดขายเฉลี่ย',
    value: '฿624',
    change: '-2.4%',
    changeType: 'negative',
    trendType: 'down',
  },
  {
    title: 'Refund Rate',
    value: '2.8%',
    change: '-0.5%',
    changeType: 'positive',
    trendType: 'down',
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

      <Divider />

      <div className='grid w-full grid-cols-2 gap-5'>
        <Card>
          <CardHeader className='justify-between'>
            <span className='font-bold'>ออเดอร์ใหม่</span>
            <span className='text-default-500'>ดูเพิ่มเติม</span>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className='justify-between'>
            <span className='font-bold'>ลูกค้าใหม่</span>
            <span className='text-default-500'>ดูเพิ่มเติม</span>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className='justify-between'>
            <span className='font-bold'>สินค้าขายดี</span>
            <span className='text-default-500'>ดูเพิ่มเติม</span>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className='justify-between'>
            <span className='font-bold'>สต็อกกำลังหมด</span>
            <span className='text-default-500'>ดูเพิ่มเติม</span>
          </CardHeader>
        </Card>
      </div>
    </section>
  )
}

export default DashboardHome
