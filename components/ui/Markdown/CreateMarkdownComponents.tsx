/* eslint-disable @next/next/no-img-element */
import type { Components } from 'react-markdown'

import { cn } from '@/utils/style'

type AdmonitionType = 'note' | 'tip' | 'danger' | 'info' | 'caution'

const ADMONITION_COLORS: Record<AdmonitionType, string> = {
  note: 'border-l-blue-500 bg-blue-50/50 text-blue-900',
  tip: 'border-l-emerald-500 bg-emerald-50/50 text-emerald-900',
  danger: 'border-l-red-500 bg-red-50/50 text-red-900',
  info: 'border-l-sky-500 bg-sky-50/50 text-sky-900',
  caution: 'border-l-amber-500 bg-amber-50/50 text-amber-900',
}

const CreateMarkdownComponents = (fallbackAlt: string): Components => ({
  li: ({ children, className, ...props }) => {
    const isTask = className?.includes('task-list-item')
    return (
      <li
        {...props}
        className={cn(
          className,
          isTask && '-ml-6 flex list-none items-start gap-2',
        )}
      >
        {children}
      </li>
    )
  },

  input: ({ type, checked }) => {
    if (type === 'checkbox') {
      return (
        <input
          readOnly
          checked={checked}
          className='text-primary focus:ring-primary mt-1.5 h-4 w-4 rounded border-gray-300'
          type='checkbox'
        />
      )
    }
    return null
  },

  table: ({ children }) => (
    <div className='my-3 w-full overflow-x-auto'>
      <table className='min-w-[700px] border-collapse'>{children}</table>
    </div>
  ),

  img: ({ alt, ...props }) => (
    <img
      {...props}
      alt={alt || fallbackAlt}
      className='my-4 w-full rounded-lg'
      loading='lazy'
    />
  ),

  div: ({ className, children, ...props }) => {
    const classList = className?.split(' ') || []
    const isAdmonition = classList.includes('admonition')
    const type = classList.find((c): c is AdmonitionType =>
      Object.keys(ADMONITION_COLORS).includes(c),
    )

    if (isAdmonition && type) {
      const colorStyle = ADMONITION_COLORS[type]
      return (
        <div
          className={cn(
            'font-anuphan my-6 rounded-r-lg border-l-[4px] p-4 leading-relaxed shadow-sm',
            colorStyle,
          )}
        >
          {children}
        </div>
      )
    }

    return (
      <div {...props} className={className}>
        {children}
      </div>
    )
  },
})

export { CreateMarkdownComponents }
