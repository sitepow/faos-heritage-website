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
import { Edit, EllipsisVertical, Trash } from 'lucide-react'

import type { ComponentProps } from 'react'

import { TrendCard } from '@/app/(dashboard)/_components/chart/trend-card'

const MOCKUP_DASHBOARD_CONST: ComponentProps<typeof TrendCard>[] = [
  {
    name: 'ข่าวสารทั้งหมด',
    value: 89,
  },
  {
    name: 'เผยแพร่แล้ว',
    value: 20,
  },
  {
    name: 'ฉบับร่าง',
    value: 40,
  },
]

const MOCKUP_ARTICLE_CONST = [
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
        {MOCKUP_DASHBOARD_CONST.map((data) => (
          <TrendCard key={data.name} {...data} />
        ))}
      </div>

      <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
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
          {MOCKUP_ARTICLE_CONST.map((article) => (
            <TableRow key={article.id}>
              <TableCell>{article.id}</TableCell>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.author}</TableCell>
              <TableCell>{article.date}</TableCell>
              <TableCell>
                {article.isExternal
                  ? 'เนื้อหานอกเว็บไซต์'
                  : 'เนื้อหาภายในเว็บไซต์'}
              </TableCell>
              <TableCell>{article.status}</TableCell>
              <TableCell className='flex gap-2.5'>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVertical className='size-5 text-default-500' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='จัดการข่าวสาร'
                    className='min-w-[180px]'
                  >
                    <DropdownItem
                      key='edit'
                      startContent={<Edit className='size-4' />}
                    >
                      แก้ไขข้อมูล
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<Trash className='size-4 text-danger' />}
                    >
                      ลบข่าวสาร
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

export default Article
