import { CategoryLayout } from './layout'

import { getProducts } from '@/actions/product'
import { getCategories } from '@/app/(dashboard)/dashboard/product/actions/category'

const ITEM_PER_PAGE = 8

const CategorySection = async () => {
  const categories = await getCategories()

  const categoryId = categories?.[0]?.id
  const products = categoryId
    ? await getProducts({ limit: ITEM_PER_PAGE, categoryId: categoryId })
    : { items: [], nextCursor: null, totalCount: 0 }

  return (
    <CategoryLayout
      initialCategories={categories}
      initialProducts={products}
      itemPerPage={ITEM_PER_PAGE}
    />
  )
}

export { CategorySection }
