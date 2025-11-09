'use client'

import { Button } from '@heroui/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from '@heroui/react'
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table'
import { Edit, EllipsisVertical, ImageIcon, Layout, Trash } from 'lucide-react'

import type { ComponentProps } from 'react'

import { ProductForm } from '../components/form/product'
import { ProductImageForm } from '../components/form/product-image'
import { ProductVariantForm } from '../components/form/product-variant'

import { TrendCard } from '@/app/(dashboard)/_components/chart/trend-card'

const mockDashboardData: ComponentProps<typeof TrendCard>[] = [
  {
    title: 'สินค้าทั้งหมด',
    value: '156',
    change: '+8.3%',
    changeType: 'positive',
    trendType: 'up',
  },
  {
    title: 'พร้อมขาย (ยังมีสินค้า)',
    value: '150',
    change: '+8.3%',
    changeType: 'positive',
    trendType: 'up',
  },
  {
    title: 'ไม่พร้อมขาย (สินค้าหมด)',
    value: '6',
    change: '+8.3%',
    changeType: 'positive',
    trendType: 'up',
  },
]

const mockProductData = [
  {
    id: 'PRD001',
    name: 'สินค้า A',
    category: 'อิเล็กทรอนิกส์',
    price: '15,000',
    stock: '45',
  },
  {
    id: 'PRD002',
    name: 'สินค้า B',
    category: 'เครื่องใช้ไฟฟ้า',
    price: '8,500',
    stock: '23',
  },
]

const Product = () => {
  const {
    isOpen: isProductFormOpen,
    onOpen: onProductFormOpen,
    onOpenChange: onOpenProductFormChange,
  } = useDisclosure()

  const {
    isOpen: isProductImageFormOpen,
    onOpen: onProductImageFormOpen,
    onOpenChange: onOpenProductImageFormChange,
  } = useDisclosure()

  const {
    isOpen: isProductVarientFormOpen,
    onOpen: onProductVarientFormOpen,
    onOpenChange: onOpenProductVarientFormChange,
  } = useDisclosure()

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <ProductForm
        isOpen={isProductFormOpen}
        onOpenChange={onOpenProductFormChange}
      />
      <ProductImageForm
        isOpen={isProductImageFormOpen}
        onOpenChange={onOpenProductImageFormChange}
      />
      <ProductVariantForm
        isOpen={isProductVarientFormOpen}
        onOpenChange={onOpenProductVarientFormChange}
      />

      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {mockDashboardData.map((data) => (
          <TrendCard key={data.title} {...data} />
        ))}
      </div>

      <div className='flex w-full justify-end gap-4'>
        <Button
          onPress={() => {
            onProductFormOpen()
          }}
        >
          เพิ่มสินค้าใหม่
        </Button>
        <Button>ส่งออกไฟล์ XLSX</Button>
        <Button>ลบรายการที่เลือก</Button>
      </div>

      <Table aria-label='ตารางข้อมูลสินค้า' selectionMode='multiple'>
        <TableHeader>
          <TableColumn>รหัสสินค้า</TableColumn>
          <TableColumn>ชื่อสินค้า</TableColumn>
          <TableColumn>หมวดหมู่</TableColumn>
          <TableColumn>ราคา (บาท)</TableColumn>
          <TableColumn>คงเหลือ</TableColumn>
          <TableColumn>จัดการ</TableColumn>
        </TableHeader>
        <TableBody>
          {mockProductData.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className='flex gap-2.5'>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVertical className='h-5 w-5 text-default-500' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='จัดการสินค้า'
                    className='min-w-[180px]'
                  >
                    <DropdownItem
                      key='edit'
                      startContent={<Edit className='h-4 w-4' />}
                      onClick={() => onProductFormOpen()}
                    >
                      แก้ไขข้อมูล
                    </DropdownItem>
                    <DropdownItem
                      key='image'
                      startContent={<ImageIcon className='h-4 w-4' />}
                      onClick={() => onProductImageFormOpen()}
                    >
                      จัดการรูปภาพ
                    </DropdownItem>
                    <DropdownItem
                      key='variant'
                      startContent={<Layout className='h-4 w-4' />}
                      onClick={() => onProductVarientFormOpen()}
                    >
                      จัดการตัวเลือก
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<Trash className='h-4 w-4 text-danger' />}
                    >
                      ลบสินค้า
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

export default Product
