import { ProductIndex } from './_components/section/product-index'

import { getProducts } from '@/actions/product'
import { CategorySection } from '@/app/(main)/_components/section/category'

const ITEM_PER_PAGE = 12

const Index = async () => {
  const products = await getProducts({ limit: ITEM_PER_PAGE })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <CategorySection />

      {products?.items?.length !== 0 && (
        <ProductIndex initialProducts={products} itemPerPage={ITEM_PER_PAGE} />
      )}
    </section>
  )
}

export default Index
