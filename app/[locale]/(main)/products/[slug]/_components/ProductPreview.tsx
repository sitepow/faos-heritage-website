'use client'

import { ProductImagePreview } from './ProductImagePreview'
import { ProductPurchasePanel } from './ProductPurchasePanel'

import { Container } from '@/components/layouts/Container'
import { useProductDetailStore } from '@/features/product/product.store'

const ProductPreview = () => {
  const { product } = useProductDetailStore()

  return (
    <Container className='grid items-start gap-5 lg:grid-cols-2'>
      <div className='min-w-0 overflow-hidden'>
        <ProductImagePreview
          images={product?.images?.map((image) => image.url)}
        />
      </div>
      <div className='min-w-0 lg:sticky lg:top-20'>
        <ProductPurchasePanel />
      </div>
    </Container>
  )
}

export { ProductPreview }
