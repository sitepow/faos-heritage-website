import { CategorySection } from '@/app/(main)/_components/section/category'
import { Header } from './_components/section/header'
import { ProductSection } from './_components/section/product'

import { getProducts } from '@/actions/product'
import { Button } from '@heroui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ITEM_PER_PAGE = 12

const Home = async () => {
  const products = await getProducts({ limit: ITEM_PER_PAGE })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <CategorySection />
      <Header
        description='ค้นหาสินค้าที่ตรงใจและตอบโจทย์ความต้องการของคุณ'
        title='เลือกสินค้าตามสไตล์'
      />

      <ProductSection isLoading={false} itemPerPage={ITEM_PER_PAGE} items={products?.items ?? []} />

      <Link href='/products'>
        <Button endContent={<ArrowRight className='text-default-500' />} variant='faded'>
          สำรวจสินค้าทั้งหมด
        </Button>
      </Link>
    </section>
  )
}

export default Home
