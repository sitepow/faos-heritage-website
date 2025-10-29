'use client'

import {
  Breadcrumbs,
  BreadcrumbItem,
  Button,
  Switch,
  Divider,
} from '@heroui/react'
import { ArrowUpDownIcon, Settings2Icon } from 'lucide-react'

import { ProductSection } from '@/components/product/product-section'
import { PRODUCT_CONSTANT } from '@/utils/const'

const Products = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full justify-start'>
        <Breadcrumbs className='font-bold'>
          <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
          <BreadcrumbItem>สินค้าทั้งหมด</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      <span className='text-2xl'>สินค้าทั้งหมด</span>

      <div className='flex w-full justify-between'>
        <span className='text-red-800'>
          สินค้ารายการที่ 1 - 9 จาก ทั้งหมด 350 รายการ
        </span>

        <div className='flex gap-2.5'>
          <Switch defaultSelected color='danger'>
            แสดงเฉพาะสินค้าพร้อมส่ง
          </Switch>
          <Button startContent={<Settings2Icon />} variant='bordered'>
            ตัวกรอง
          </Button>
          <Button startContent={<ArrowUpDownIcon />} variant='bordered'>
            การเรียงลำดับ
          </Button>
        </div>
      </div>

      <Divider />

      <ProductSection hideIcon={false} items={PRODUCT_CONSTANT?.slice(0, 8)} />
    </section>
  )
}

export default Products
