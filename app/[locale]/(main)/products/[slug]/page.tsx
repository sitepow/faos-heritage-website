import { ProductClient } from './product.client'

import { getProduct } from '@/features/product/product.action'
import { getServerUser } from '@/lib/session'
import { parseSlug } from '@/lib/slug'

interface ProductProps {
  params: Promise<{ slug: string; locale: string }>
}

const ProductPage = async ({ params }: ProductProps) => {
  const { slug } = await params
  const { userId } = await getServerUser()
  const productId = parseSlug(slug)

  const product = await getProduct(productId, userId)

  return (
    <ProductClient
      initialData={product}
      productId={productId}
      userId={userId!}
    />
  )
}

export default ProductPage
