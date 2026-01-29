/* eslint-disable @next/next/no-img-element */
import type { Components } from 'react-markdown'

const CreateMarkdownComponents = (fallbackAlt: string): Components => ({
  table: ({ children }) => (
    <div className='my-3 w-full overflow-x-auto'>
      <table className='min-w-[700px]'>{children}</table>
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
})

export { CreateMarkdownComponents }
