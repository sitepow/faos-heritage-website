import { CategorySection } from '@/app/(main)/_components/section/category'
import { Header } from './_components/section/header'
import { ProductSection } from './_components/section/product'

import { getProducts } from '@/actions/product'

const ITEM_PER_PAGE = 8

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
    </section>
  )
}

export default Home
