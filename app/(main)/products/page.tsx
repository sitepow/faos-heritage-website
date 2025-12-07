import { ProductLayout } from './_components/layout'

import { getProducts } from '@/actions/product'

const ITEM_PER_PAGE = 8

const CategorySection = async () => {
  const products = await getProducts({ limit: ITEM_PER_PAGE })

  return (
    <ProductLayout initialProducts={products} itemPerPage={ITEM_PER_PAGE} />
  )
}

export default CategorySection
