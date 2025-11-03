import { NewsSection } from './_components/news/news-section'

import { CategorySection } from '@/app/(main)/_components/category/category-section'
import { ProductSection } from '@/app/(main)/_components/product/product-section'
import { HomePageHeaderTitle } from '@/app/(main)/_components/section/homepage-header-title'
import { PRODUCT_CONSTANT } from '@/utils/const'

const Home = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <CategorySection />

      <HomePageHeaderTitle
        description='ค้นหาสินค้าที่ตรงใจและตอบโจทย์ความต้องการของคุณ'
        title='เลือกสินค้าตามสไตล์'
      />

      <ProductSection items={PRODUCT_CONSTANT?.slice(0, 8)} />

      <NewsSection />
    </section>
  )
}

export default Home
