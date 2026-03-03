/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkDirective from 'remark-directive'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'

import { CreateMarkdownComponents } from './CreateMarkdownComponents'

import { cn } from '@/utils/style'

const remarkDirectiveToRehype = () => {
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        const data = node.data || (node.data = {})
        data.hName = 'div'
        data.hProperties = {
          className: cn('admonition', node.name, node.attributes?.class),
        }
      }
    })
  }
}

interface Props {
  content: string
  fallbackAlt?: string
  className?: string
}

const MarkdownRenderer = ({
  content,
  fallbackAlt = 'image',
  className,
}: Props) => {
  const components = useMemo(
    () => CreateMarkdownComponents(fallbackAlt),
    [fallbackAlt],
  )

  const sanitizeSchema = useMemo(
    () => ({
      ...defaultSchema,
      tagNames: [
        ...(defaultSchema.tagNames || []),
        'mark',
        'div',
        'span',
        'input',
      ],
      attributes: {
        ...defaultSchema.attributes,
        div: [...(defaultSchema.attributes?.div || []), 'className'],
        input: ['type', 'checked', 'readOnly', 'className'],
      },
    }),
    [],
  )

  return (
    <article
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none',

        'text-[16px] leading-[1.625] tracking-[-0.003em] antialiased sm:text-[18px]',

        'prose-p:mb-6 prose-p:leading-[1.625] prose-p:text-default-700',

        'prose-h1:mt-10 prose-h1:mb-5 prose-h1:text-3xl prose-h1:font-bold prose-h1:tracking-tight sm:text-4xl',
        'prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight sm:text-3xl',
        'prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-bold sm:text-2xl',

        'prose-ul:my-5 prose-ol:my-5',
        'prose-li:mb-1.5 prose-li:leading-relaxed',

        'prose-blockquote:border-l-primary prose-blockquote:border-l-[3px] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-default-600',

        'prose-table:my-8',
        'prose-img:my-8 prose-img:rounded-xl',

        '[&_mark]:mx-0.5 [&_mark]:rounded-sm [&_mark]:bg-yellow-200/80 [&_mark]:px-1 [&_mark]:font-medium [&_mark]:text-neutral-900',

        className,
      )}
    >
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveToRehype]}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}

export { MarkdownRenderer }
