import { cva } from 'class-variance-authority'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import type { ComponentProps } from 'react'

import { cn } from '@/utils/style'

type CarouselNavigateButtonProps = ComponentProps<'button'> & {
  direction: 'prev' | 'next'
}

const variants = cva(
  cn(
    'flex size-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md',
    'hover:bg-gray-50',
    'focus-visible:ring focus-visible:outline-none',
  ),
)

export const CarouselNavigateButton = ({
  direction,
  className,
  ...props
}: CarouselNavigateButtonProps) => {
  if (direction === 'prev') {
    return (
      <button className={variants({ className })} {...props}>
        <span className='sr-only'>previous</span>
        <ChevronLeftIcon className='size-5 *:stroke-gray-500' />
      </button>
    )
  }

  return (
    <button className={variants({ className })} {...props}>
      <span className='sr-only'>next</span>
      <ChevronRightIcon className='size-5 *:stroke-gray-500' />
    </button>
  )
}
