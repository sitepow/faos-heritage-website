/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @next/next/no-img-element */
import { Card, CardBody } from '@heroui/card'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import type { GetProductResult } from '@/app/(dashboard)/actions/product'
import type { FC } from 'react'

interface Props {
  product: GetProductResult
}

const DetailCard: FC<Props> = ({ product }) => {
  if (!product?.description) return null

  return (
    <Card
      className='mx-auto max-w-3xl border-divider bg-default-50 dark:border dark:bg-default-100/10'
      shadow='none'
    >
      <CardBody className='px-6 py-8'>
        <article className='prose max-w-none prose-neutral dark:prose-invert prose-p:leading-relaxed'>
          <ReactMarkdown
            components={{
              img: ({ alt, ...props }) => (
                <img
                  {...props}
                  alt={alt || product.name}
                  className='my-6 w-full rounded-xl shadow-md'
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

export { DetailCard }
