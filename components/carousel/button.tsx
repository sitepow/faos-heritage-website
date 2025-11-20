import { cva } from 'class-variance-authority'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

interface Props {
  direction: 'prev' | 'next'
}

const variants = cva(
  cn(
    'flex size-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md',
    'hover:bg-gray-50',
    'focus-visible:ring focus-visible:outline-none',
  ),
)

const CarouselNavigateButton: FC<Props & ComponentProps<'button'>> = ({
  direction,
  className,
  ...props
}) => {
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

export default CarouselNavigateButton
