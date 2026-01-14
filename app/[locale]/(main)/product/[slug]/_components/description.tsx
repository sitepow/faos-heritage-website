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

  if (!product?.description) return null

  return (
    <Card className='bg-default-50' shadow='none'>
      <CardBody className='p-6'>
        <article className='prose prose-neutral dark:prose-invert /* typography base */ /* paragraph – Amazon/Shopee style */ prose-p:my-1.5 prose-p:leading-relaxed /* lists */ prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-li:leading-relaxed /* headings (ไม่ให้ดูเป็น blog) */ prose-h1:text-lg prose-h1:my-3 prose-h2:text-base prose-h2:my-2 prose-h3:text-sm prose-h3:my-2 /* */ prose-table:my-3 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 /* misc */ prose-br:leading-none mx-auto table w-full max-w-[920px] text-sm leading-relaxed sm:text-base'>
          <ReactMarkdown
            components={{
              table: ({ children }) => (
                <div className='my-3 w-full overflow-x-auto'>
                  <table className='min-w-[700px] rounded-none'>
                    {children}
                  </table>
                </div>
              ),
              img: ({ alt, ...props }) => (
                <img
                  {...props}
                  alt={alt || product?.name!}
                  className='my-4 w-full rounded-lg'
                  loading='lazy'
                />
              ),
            }}
            rehypePlugins={[rehypeSanitize]}
            remarkPlugins={[remarkGfm]}
          >
            {product.description}
          </ReactMarkdown>
        </article>
      </CardBody>
    </Card>
  )
}
