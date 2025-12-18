import { getCategories } from '../(dashboard)/actions/category'
import { CategoryClient } from './_components/client/category'

import { ExploreProducts } from '@/app/(main)/_components/client/explore-products'
import { getProducts } from '@/app/(main)/actions/product'
import { BannerCertificate } from '@/components/banner/certificate'
import { ITEM_PER_PAGE } from '@/utils/const'

const Index = async () => {
  const categories = await getCategories()
  const exploreProducts = await getProducts({ limit: ITEM_PER_PAGE })

  const categoryId = categories?.[0]?.id
  const products = categoryId
    ? await getProducts({ limit: ITEM_PER_PAGE, categoryId: categoryId })
    : { items: [], nextCursor: null, totalCount: 0 }

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <CategoryClient
        initialCategories={categories}
        initialProducts={products}
        itemPerPage={ITEM_PER_PAGE}
      />

      <BannerCertificate />
      {products?.items?.length !== 0 && (
        <ExploreProducts
          initialProducts={exploreProducts}
          itemPerPage={ITEM_PER_PAGE}
        />
      )}
    </section>
  )
}

export default Index
