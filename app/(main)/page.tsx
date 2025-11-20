import { ArticleSection } from './_components/section/article'
import { Header } from './_components/section/header'
import { ProductSection } from './_components/section/product'

import { CategorySection } from '@/app/(main)/_components/section/category'
import { PRODUCT_CONSTANT } from '@/utils/const'

const Home = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <CategorySection />
      <Header
        description='ค้นหาสินค้าที่ตรงใจและตอบโจทย์ความต้องการของคุณ'
        title='เลือกสินค้าตามสไตล์'
      />
      <ProductSection items={PRODUCT_CONSTANT?.slice(0, 8)} />
      <ArticleSection />
    </section>
  )
}

export default Home
