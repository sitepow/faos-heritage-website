import { ProductLayout } from './_components/layout'

import { getProducts } from '@/actions/product'
import { NotFound } from '@/components/not-found'

const ITEM_PER_PAGE = 8

const CategorySection = async () => {
  let products

  try {
    products = await getProducts({ limit: ITEM_PER_PAGE })
  } catch {
    return (
      <NotFound>
        We apologize, the product was not found in our system. Please try
        searching for the product again on the homepage.
      </NotFound>
    )
  }

  return (
    <ProductLayout initialProducts={products} itemPerPage={ITEM_PER_PAGE} />
  )
}

export default CategorySection
