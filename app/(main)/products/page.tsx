import { PageNotFound } from '@/app/(main)/_components/page-not-found'
import { getProducts } from '@/app/(main)/actions/product'
import { ProductsClient } from '@/app/(main)/products/_components/client/products'
import { ITEM_PER_PAGE } from '@/utils/const'

const CategorySection = async () => {
  let products

  try {
    products = await getProducts({ limit: ITEM_PER_PAGE })
  } catch {
    return (
      <PageNotFound>
        We apologize, the product was not found in our system. Please try
        searching for the product again on the homepage.
      </PageNotFound>
    )
  }

  return (
    <ProductsClient initialProducts={products} itemPerPage={ITEM_PER_PAGE} />
  )
}

export default CategorySection
