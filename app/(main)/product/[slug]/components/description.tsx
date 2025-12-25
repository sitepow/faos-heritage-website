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

  return (
    <Card className='bg-default-50' shadow='none'>
      <CardBody className='px-6 py-8'>
        <article className='prose prose-neutral dark:prose-invert prose-p:leading-relaxed mx-auto max-w-5xl'>
          <div className='not-prose grid gap-5'>
            {product?.images?.map((image) => (
              <div className='mx-auto flex flex-col gap-1'>
                <img
                  className='h-fit w-[500px] object-contain'
                  loading='lazy'
                  src={image?.url || '/images/no-image.png'}
                  alt={image?.alt!}
                />
                <span className='text-default-500 mt-2.5 break-all'>
                  {image?.alt!}
                </span>
              </div>
            ))}
          </div>

          <ReactMarkdown
            components={{
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
