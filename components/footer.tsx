import type { ComponentProps, FC } from 'react'

import { getFooter } from '@/utils/helper'
import { cn } from '@/utils/style'

const Footer: FC<ComponentProps<'footer'>> = ({ className, ...props }) => {
  return (
    <footer
      className={cn(
        'flex w-full items-center justify-center px-10 py-2 text-center',
        className,
      )}
      {...props}
    >
      <span className='text-default-600'>{getFooter()}</span>
    </footer>
  )
}

export { Footer }
