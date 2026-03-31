'use client'

import { ProductImagePreview } from './ProductImagePreview'
import { ProductPurchasePanel } from './ProductPurchasePanel'

import { Container } from '@/components/layouts/Container'
import { useProductDetailStore } from '@/features/product/store'

const ProductPreview = () => {
  const { product } = useProductDetailStore()

  return (
    <Container className='grid items-start gap-5 lg:grid-cols-2'>
      <figure className='m-0 min-w-0'>
        <ProductImagePreview
          images={product?.images?.map((image) => image.url)}
          product={product}
        />
      </figure>
      <aside className='min-w-0 lg:sticky lg:top-20'>
        <ProductPurchasePanel />
      </aside>
    </Container>
  )
}

export { ProductPreview }
