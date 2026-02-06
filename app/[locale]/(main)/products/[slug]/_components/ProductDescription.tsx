'use client'

import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { useProductDetailStore } from '@/features/product/product.store'

const ProductDescription = () => {
  const { product } = useProductDetailStore()

  if (!product?.description) {
    return null
  }

  return (
    <MarkdownRenderer
      className='mx-auto w-full max-w-[920px]'
      content={product.description}
      fallbackAlt={product.name}
    />
  )
}

export { ProductDescription }
