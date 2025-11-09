'use client'

import { BreadcrumbItem, Breadcrumbs } from '@heroui/react'

import { ProductAddToCartSection } from './_components/product-add-to-cart-section'
import { ProductDetailSection } from './_components/product-detail-section'
import { ProductImageDetailSection } from './_components/product-image-detail-section'
import { ProductSimilarSection } from './_components/product-similar-section'

const Product = () => {
  return (
    <section className='flex flex-col justify-center gap-4 text-center'>
      <Breadcrumbs className='font-bold'>
        <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
        <BreadcrumbItem>เครื่องใช้ไฟฟ้า</BreadcrumbItem>
      </Breadcrumbs>
      <div className='grid grid-cols-3 gap-4'>
        <ProductImageDetailSection />
        <ProductAddToCartSection />
      </div>
      <ProductDetailSection />
      <ProductSimilarSection />
    </section>
  )
}

export default Product
