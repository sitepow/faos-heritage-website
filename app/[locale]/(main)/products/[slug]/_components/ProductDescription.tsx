'use client'

import { Card, CardBody } from '@heroui/react'

import { useProductDetailStore } from '../store'

import { MarkdownRenderer } from '@/components/ui/Markdown/MarkdownRenderer'

const ProductDescription = () => {
  const { product } = useProductDetailStore()

  if (!product?.description) {
    return null
  }

  return (
    <Card
      className='border-divider container mx-auto border'
      radius='sm'
      shadow='none'
    >
      <CardBody>
        <MarkdownRenderer
          className='mx-auto w-full max-w-[920px]'
          content={product.description}
          fallbackAlt={product.name}
        />
      </CardBody>
    </Card>
  )
}

export { ProductDescription }
