'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { CreateMarkdownComponents } from './CreateMarkdownComponents'

import { cn } from '@/utils/style'

interface MarkdownRendererProps {
  content: string
  fallbackAlt?: string
  className?: string
}

export const MarkdownRenderer = ({
  content,
  fallbackAlt = 'image',
  className,
}: MarkdownRendererProps) => {
  const components = useMemo(
    () => CreateMarkdownComponents(fallbackAlt),
    [fallbackAlt],
  )

  return (
    <article
      className={cn(
        'prose prose-neutral dark:prose-invert',
        'text-sm leading-relaxed sm:text-base',

        'prose-p:my-1.5 prose-p:leading-relaxed',

        'prose-h1:my-3 prose-h1:text-lg',
        'prose-h2:my-2 prose-h2:text-base',
        'prose-h3:my-2 prose-h3:text-sm',

        'prose-ul:my-2 prose-ol:my-2',
        'prose-li:my-0.5 prose-li:leading-relaxed',

        'prose-table:my-3',
        'prose-th:px-3 prose-th:py-2',
        'prose-td:px-3 prose-td:py-2',

        'prose-br:leading-none',

        className,
      )}
    >
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}
