'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'

import { CartSection } from './_components/section/cart'
import { DetailSection } from './_components/section/detail'
import { ImageSection } from './_components/section/image'
import { SimilarSection } from './_components/section/similar'

const Product = () => {
  return (
    <section className='flex flex-col justify-center gap-4 text-center'>
      <Breadcrumbs className='font-bold'>
        <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
        <BreadcrumbItem>เครื่องใช้ไฟฟ้า</BreadcrumbItem>
      </Breadcrumbs>
      <div className='grid grid-cols-3 gap-4'>
        <ImageSection />
        <CartSection />
      </div>
      <DetailSection />
      <SimilarSection />
    </section>
  )
}

export default Product
