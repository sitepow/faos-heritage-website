import { BreadcrumbItem, Breadcrumbs } from '@heroui/breadcrumbs'

import { CartSection } from './_components/section/cart'
import { DetailSection } from './_components/section/detail'
import { ImageSection } from './_components/section/image'

const Product = () => {
  return (
    <section className='flex flex-col justify-center gap-4 text-center'>
      <Breadcrumbs className='font-bold'>
        <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
        <BreadcrumbItem>เครื่องใช้ไฟฟ้า</BreadcrumbItem>
      </Breadcrumbs>
      <div className='grid gap-4 xl:grid-cols-3'>
        <ImageSection className='xl:col-span-2' />
        <CartSection />
      </div>
      <DetailSection />
      {/* <SimilarSection /> */}
    </section>
  )
}

export default Product
