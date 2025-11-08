'use client'

import { Button } from '@heroui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table'
import { Edit, Trash } from 'lucide-react'

import type { ComponentProps } from 'react'

import { TrendCard } from '@/app/(dashboard)/_components/chart/trend-card'

const mockDashboardData: ComponentProps<typeof TrendCard>[] = [
  {
    title: 'คำสั่งซื้อทั้งหมด',
    value: '328',
    change: '+15.2%',
    changeType: 'positive',
    trendType: 'up',
  },
  {
    title: 'ปิดคำสั่งซื้อแล้ว',
    value: '200',
    change: '+15.2%',
    changeType: 'positive',
    trendType: 'up',
  },
  {
    title: 'คำสั่งซื้อล้มเหลว',
    value: '128',
    change: '+15.2%',
    changeType: 'positive',
    trendType: 'up',
  },
]

const mockOrderData = [
  {
    id: 'ORD001',
    customer: 'บริษัท ABC จำกัด',
    date: '2024-10-25',
    total: '45,000',
    status: 'กำลังดำเนินการ',
  },
  {
    id: 'ORD002',
    customer: 'ร้าน XYZ',
    date: '2024-10-26',
    total: '28,500',
    status: 'เสร็จสิ้น',
  },
]

const Order = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {mockDashboardData.map((data) => (
          <TrendCard key={data.title} {...data} />
        ))}
      </div>

      <div className='flex w-full justify-end gap-4'>
        <Button>สร้างคำสั่งซื้อใหม่</Button>
        <Button>ส่งออกไฟล์ XLSX</Button>
        <Button>ลบรายการที่เลือก</Button>
      </div>

      <Table aria-label='ตารางข้อมูลคำสั่งซื้อ' selectionMode='multiple'>
        <TableHeader>
          <TableColumn>รหัสคำสั่งซื้อ</TableColumn>
          <TableColumn>ลูกค้า</TableColumn>
          <TableColumn>วันที่สั่งซื้อ</TableColumn>
          <TableColumn>ยอดรวม (บาท)</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn>จัดการ</TableColumn>
        </TableHeader>
        <TableBody>
          {mockOrderData.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell className='flex gap-2.5'>
                <Edit className='cursor-pointer text-default-500' />
                <Trash className='cursor-pointer text-default-500' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export default Order
