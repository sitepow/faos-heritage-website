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

const MOCKUP_CONST: ComponentProps<typeof TrendCard>[] = [
  {
    title: 'ข่าวสารทั้งหมด',
    value: 89,
  },
  {
    title: 'เผยแพร่แล้ว',
    value: 20,
  },
  {
    title: 'ฉบับร่าง',
    value: 40,
  },
]

const mockNewsData = [
  {
    id: 'NEWS001',
    title: 'เปิดตัวสินค้าใหม่ประจำเดือนตุลาคม',
    author: 'ทีมการตลาด',
    date: '2024-10-28',
    status: 'เผยแพร่แล้ว',
    isExternal: false,
  },
  {
    id: 'NEWS002',
    title: 'กิจกรรมส่งเสริมการขายช่วงปลายปี',
    author: 'ผู้จัดการฝ่ายขาย',
    date: '2024-10-27',
    status: 'แบบร่าง',
    isExternal: true,
  },
]

const Article = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {MOCKUP_CONST.map((data) => (
          <TrendCard key={data.title} {...data} />
        ))}
      </div>

      <div className='flex w-full justify-end gap-4'>
        <Button>เพิ่มข่าวสารใหม่</Button>
        <Button>ส่งออกไฟล์ XLSX</Button>
        <Button>ลบรายการที่เลือก</Button>
      </div>

      <Table aria-label='ตารางข้อมูลข่าวสาร' selectionMode='multiple'>
        <TableHeader>
          <TableColumn>รหัสข่าว</TableColumn>
          <TableColumn>หัวข้อข่าว</TableColumn>
          <TableColumn>ผู้เขียน</TableColumn>
          <TableColumn>วันที่เผยแพร่</TableColumn>
          <TableColumn>ประเภท</TableColumn>
          <TableColumn>สถานะ</TableColumn>
          <TableColumn>จัดการ</TableColumn>
        </TableHeader>
        <TableBody>
          {mockNewsData.map((news) => (
            <TableRow key={news.id}>
              <TableCell>{news.id}</TableCell>
              <TableCell>{news.title}</TableCell>
              <TableCell>{news.author}</TableCell>
              <TableCell>{news.date}</TableCell>
              <TableCell>
                {news.isExternal
                  ? 'เนื้อหานอกเว็บไซต์'
                  : 'เนื้อหาภายในเว็บไซต์'}
              </TableCell>
              <TableCell>{news.status}</TableCell>
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

export default Article
