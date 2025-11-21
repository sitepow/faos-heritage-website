'use client'

import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Divider,
  Switch,
} from '@heroui/react'
import { ArrowUpDownIcon, Settings2Icon } from 'lucide-react'

import { ProductSection } from '../_components/section/product'

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

      <div className='flex w-full flex-wrap items-center justify-between gap-3'>
        <span className='text-primary-website'>
          สินค้ารายการที่ 1 - 9 จาก ทั้งหมด 350 รายการ
        </span>

        <div className='flex flex-wrap gap-3'>
          <Switch defaultSelected color='primary'>
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
