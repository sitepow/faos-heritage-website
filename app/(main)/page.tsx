'use client'

import { useQuery } from '@tanstack/react-query'

import { ArticleSection } from './_components/section/article'
import { Header } from './_components/section/header'
import { ProductSection } from './_components/section/product'

import { getProducts } from '@/actions/product'
import { CategorySection } from '@/app/(main)/_components/section/category'

const ITEM_PER_PAGE = 8
const Home = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'random'],
    queryFn: () => getProducts({ limit: ITEM_PER_PAGE }),
  })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <CategorySection />
      <Header
        description='ค้นหาสินค้าที่ตรงใจและตอบโจทย์ความต้องการของคุณ'
        title='เลือกสินค้าตามสไตล์'
      />

      <ProductSection
        isLoading={isLoading}
        itemPerPage={ITEM_PER_PAGE}
        items={products?.items ?? []}
      />
      <ArticleSection />
    </section>
  )
}

export default Home
