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

import { ProductForm } from './_components/form/product'
import { ImageManager } from './_components/manager/image'
import { VariantManager } from './_components/manager/varient'

import { TrendCard } from '@/app/(dashboard)/_components/chart/trend-card'
import { formatCurrency, formatNumber } from '@/utils/number'

const MOCKUP_DASHBOARD_CONST: ComponentProps<typeof TrendCard>[] = [
  {
    title: 'สินค้าทั้งหมด',
    value: 156,
  },
  {
    title: 'พร้อมขาย (ยังมีสินค้า)',
    value: 150,
  },
  {
    title: 'ไม่พร้อมขาย (สินค้าหมด)',
    value: 6,
  },
]

const MOCKUP_PRODUCT_CONST = [
  {
    id: 'PRD001',
    name: 'สินค้า A',
    category: 'อิเล็กทรอนิกส์',
    price: 50202,
    stock: 23,
  },
  {
    id: 'PRD002',
    name: 'สินค้า B',
    category: 'เครื่องใช้ไฟฟ้า',
    price: 5211,
    stock: 53,
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
      <ImageManager
        isOpen={isProductImageFormOpen}
        onOpenChange={onOpenProductImageFormChange}
      />
      <VariantManager
        isOpen={isProductVarientFormOpen}
        onOpenChange={onOpenProductVarientFormChange}
      />
      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {MOCKUP_DASHBOARD_CONST.map((data) => (
          <TrendCard key={data.title} {...data} />
        ))}
      </div>
      <div className='flex w-full flex-wrap gap-3 *:shrink-0 md:justify-end'>
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
          {MOCKUP_PRODUCT_CONST.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{formatNumber(product.stock)}</TableCell>
              <TableCell className='flex gap-2.5'>
                <Dropdown placement='bottom-end'>
                  <DropdownTrigger>
                    <Button isIconOnly size='sm' variant='light'>
                      <EllipsisVertical className='size-5 text-default-500' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label='จัดการสินค้า'
                    className='min-w-[180px]'
                  >
                    <DropdownItem
                      key='edit'
                      startContent={<Edit className='size-4' />}
                      onClick={() => onProductFormOpen()}
                    >
                      แก้ไขข้อมูล
                    </DropdownItem>
                    <DropdownItem
                      key='image'
                      startContent={<ImageIcon className='size-4' />}
                      onClick={() => onProductImageFormOpen()}
                    >
                      จัดการรูปภาพ
                    </DropdownItem>
                    <DropdownItem
                      key='variant'
                      startContent={<Layout className='size-4' />}
                      onClick={() => onProductVarientFormOpen()}
                    >
                      จัดการตัวเลือก
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={<Trash className='size-4 text-danger' />}
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
