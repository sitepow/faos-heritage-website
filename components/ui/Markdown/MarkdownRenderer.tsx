'use client'

import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { CreateMarkdownComponents } from './CreateMarkdownComponents'

import { cn } from '@/utils/style'

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
      tagNames: [...(defaultSchema.tagNames || []), 'mark'],
    }),
    [],
  )

  return (
    <article
      className={cn(
        // พื้นฐาน Typography แบบ Medium-style
        'prose prose-neutral dark:prose-invert max-w-none',

        // Body Text: ใช้ขนาด 18px บนมือถือ และ 21px บนจอใหญ่
        'text-[18px] leading-[1.58] tracking-[-0.003em] antialiased sm:text-[21px]',

        // Paragraph: เพิ่มระยะห่างระหว่างย่อหน้าให้อ่านง่าย
        'prose-p:mb-8 prose-p:leading-[1.58] prose-p:text-default-700',

        // Headings: ปรับให้ใหญ่และเด่นชัดเหมือนบทความคุณภาพ
        'prose-h1:mt-12 prose-h1:mb-6 prose-h1:text-4xl prose-h1:font-bold prose-h1:tracking-tight sm:text-5xl',
        'prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight sm:text-4xl',
        'prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-2xl prose-h3:font-bold sm:text-3xl',

        // Lists & Items
        'prose-ul:my-6 prose-ol:my-6',
        'prose-li:mb-2 prose-li:leading-relaxed',

        // Quotes: สไตล์คำคมที่ดูพรีเมียม
        'prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-default-600',

        // Table & Media
        'prose-table:my-10',
        'prose-img:my-10 prose-img:rounded-xl',

        // --- สไตล์ไฮไลท์แบบขีดปากกา (พื้นเหลือง ข้อความขาว) ---
        '[&_mark]:mx-0.5 [&_mark]:rounded-sm [&_mark]:bg-yellow-200/80 [&_mark]:px-1 [&_mark]:font-medium [&_mark]:text-neutral-900',

        className,
      )}
    >
      <ReactMarkdown
        components={components}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}

export { MarkdownRenderer }
