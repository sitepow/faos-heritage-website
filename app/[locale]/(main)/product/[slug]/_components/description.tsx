/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @next/next/no-img-element */
'use client'

import { Card, CardBody } from '@heroui/react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { useProductDetailStore } from '../store'

export const ProductDescription = () => {
  const { product } = useProductDetailStore()

  if (!product?.description) {
    return
  }

  return (
    <Card className='bg-default-50' shadow='none'>
      <CardBody className='px-6 py-8'>
        <article className='prose prose-neutral dark:prose-invert prose-p:leading-relaxed mx-auto max-w-full sm:text-lg'>
          <ReactMarkdown
            components={{
              table: ({ children }) => (
                <div className='w-full overflow-x-auto'>
                  <table className='min-w-[800px]'>{children}</table>
                </div>
              ),
              img: ({ alt, ...props }) => (
                <img
                  {...props}
                  alt={alt || product?.name!}
                  className='my-6 w-full rounded-xl shadow-md'
                  loading='lazy'
                />
              ),
            }}
            rehypePlugins={[rehypeSanitize]}
            remarkPlugins={[remarkGfm]}
          >
            {product?.description!}
          </ReactMarkdown>
        </article>
      </CardBody>
    </Card>
  )
}
