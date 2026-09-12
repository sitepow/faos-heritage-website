/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { memo, useMemo } from 'react'
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

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'mark', 'div', 'span', 'input'],
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), 'className'],
    input: ['type', 'checked', 'readOnly', 'className'],
  },
}

const defaultRehypePlugins: any[] = [
  rehypeRaw,
  [rehypeSanitize, sanitizeSchema],
]
const defaultRemarkPlugins: any[] = [
  remarkGfm,
  remarkDirective,
  remarkDirectiveToRehype,
]

interface Props {
  content: string
  fallbackAlt?: string
  className?: string
}

const MarkdownRenderer = memo(
  ({ content, fallbackAlt = 'image', className }: Props) => {
    const components = useMemo(
      () => CreateMarkdownComponents(fallbackAlt),
      [fallbackAlt],
    )

    return (
      <article
        className={cn(
          'prose prose-neutral dark:prose-invert max-w-none',
          'text-lg tracking-tight antialiased sm:text-xl',
          className,
        )}
      >
        <ReactMarkdown
          components={components}
          rehypePlugins={defaultRehypePlugins}
          remarkPlugins={defaultRemarkPlugins}
        >
          {content}
        </ReactMarkdown>
      </article>
    )
  },
)

MarkdownRenderer.displayName = 'MarkdownRenderer'

export { MarkdownRenderer }
