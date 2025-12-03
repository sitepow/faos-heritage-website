import { getProducts } from '@/actions/product'
import ProductClient from './_components/client/product'

const ITEM_PER_PAGE = 8

const CategorySection = async () => {
  const products = await getProducts({ limit: ITEM_PER_PAGE })

  return <ProductClient initialProducts={products} itemPerPage={ITEM_PER_PAGE} />
}

export default CategorySection
