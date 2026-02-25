'use client'

import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'
import { useProductDetailStore } from '@/features/product/product.store'

const ProductDescription = () => {
  const { product } = useProductDetailStore()

  if (!product?.description) {
    return null
  }

  return (
    <article className='w-full'>
      <MarkdownRenderer
        className='mx-auto w-full max-w-[1280px]'
        content={product.description}
        fallbackAlt={product.name}
      />
    </article>
  )
}

export { ProductDescription }
