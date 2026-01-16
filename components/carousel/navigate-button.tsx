import { cva } from 'class-variance-authority'
import {
  ChevronDown,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from 'lucide-react'

import type { ComponentProps } from 'react'

import { cn } from '@/utils/style'

type Props = ComponentProps<'button'> & {
  direction: 'prev' | 'next'
  isVertical?: boolean
  orientation?: 'horizontal' | 'vertical'
}

const variants = cva(
  cn(
    'flex size-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md',
    'hover:bg-gray-50',
    'focus-visible:ring focus-visible:outline-none',
  ),
)

export const CarouselNavigateButton = ({
  isVertical,
  direction,
  className,
  ...props
}: Props) => {
  if (direction === 'prev') {
    return (
      <button className={variants({ className })} {...props}>
        <span className='sr-only'>previous</span>
        {isVertical ? (
          <ChevronUpIcon className='size-5 *:stroke-gray-500' />
        ) : (
          <ChevronLeftIcon className='size-5 *:stroke-gray-500' />
        )}
      </button>
    )
  }

  return (
    <button className={variants({ className })} {...props}>
      <span className='sr-only'>next</span>
      {isVertical ? (
        <ChevronDown className='size-5 *:stroke-gray-500' />
      ) : (
        <ChevronRightIcon className='size-5 *:stroke-gray-500' />
      )}
    </button>
  )
}
