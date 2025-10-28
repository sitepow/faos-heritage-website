import { CategorySection } from '@/components/category/category-section'
import { HomePageHeaderTitle } from '@/components/homepage/homepage-header-title'
import { NewsSection } from '@/components/news/news-section'
import { ProductSection } from '@/components/product/product-section'
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
