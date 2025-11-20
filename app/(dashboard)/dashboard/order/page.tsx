'use client'

import { Button } from '@heroui/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table'
import { Edit, EllipsisVertical } from 'lucide-react'

import type { ComponentProps } from 'react'

import { TrendCard } from '@/app/(dashboard)/_components/chart/trend-card'
import { formatCurrency } from '@/utils/number'

const MOCKUP_DASHBOARD_CONST: ComponentProps<typeof TrendCard>[] = [
  {
    title: 'คำสั่งซื้อทั้งหมด',
    value: 328,
  },
  {
    title: 'ปิดคำสั่งซื้อแล้ว',
    value: 200,
  },
  {
    title: 'คำสั่งซื้อล้มเหลว',
    value: 128,
  },
]

const MOCKUP_ORDER_CONST = [
  {
    id: 'ORD001',
    customer: 'บริษัท ABC จำกัด',
    date: '2024-10-25',
    total: 32003,
    status: 'กำลังดำเนินการ',
  },
  {
    id: 'ORD002',
    customer: 'ร้าน XYZ',
    date: '2024-10-26',
    total: 25221,
    status: 'เสร็จสิ้น',
  },
]

const Order = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {MOCKUP_DASHBOARD_CONST.map((data) => (
          <TrendCard key={data.title} {...data} />
        ))}
      </div>

      <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
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
          {MOCKUP_ORDER_CONST.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell className='flex gap-2.5'>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVertical className='size-5 text-default-500' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='จัดการออเดอร์'
                    className='min-w-[180px]'
                  >
                    <DropdownItem
                      key='edit'
                      startContent={<Edit className='size-4' />}
                    >
                      แก้ไขข้อมูล
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}

export default Order
