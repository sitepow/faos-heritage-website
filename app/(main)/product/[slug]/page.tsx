'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'

const Product = () => {
  return (
    <section className='flex flex-col justify-center gap-4 text-center'>
      <Breadcrumbs className='font-bold'>
        <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
        <BreadcrumbItem>เครื่องใช้ไฟฟ้า</BreadcrumbItem>
      </Breadcrumbs>
    </section>
  )
}

export default Product
