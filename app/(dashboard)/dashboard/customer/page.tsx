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
    title: 'ลูกค้าทั้งหมด',
    value: 240,
  },
]

const mockCustomerData = [
  {
    id: 'CUS001',
    name: 'บริษัท ABC จำกัด',
    email: 'contact@abc.com',
    phone: '02-123-4567',
  },
  {
    id: 'CUS002',
    name: 'ร้าน XYZ',
    email: 'info@xyz.com',
    phone: '02-234-5678',
  },
]

const Customer = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {mockDashboardData.map((data) => (
          <TrendCard key={data.title} {...data} />
        ))}
      </div>

      <div className='flex w-full justify-end gap-4'>
        <Button>เพิ่มลูกค้าใหม่</Button>
        <Button>ส่งออกไฟล์ XLSX</Button>
        <Button>ลบรายการที่เลือก</Button>
      </div>

      <Table aria-label='ตารางข้อมูลลูกค้า' selectionMode='multiple'>
        <TableHeader>
          <TableColumn>รหัสลูกค้า</TableColumn>
          <TableColumn>ชื่อลูกค้า</TableColumn>
          <TableColumn>อีเมล</TableColumn>
          <TableColumn>เบอร์โทร</TableColumn>
          <TableColumn>จัดการ</TableColumn>
        </TableHeader>
        <TableBody>
          {mockCustomerData.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
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

export default Customer
