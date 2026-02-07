import { cva } from 'class-variance-authority'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import type { ComponentProps } from 'react'

import { CustomIcon } from '../CustomIcon'

import { cn } from '@/utils/style'

type CarouselNavigateButtonProps = ComponentProps<'button'> & {
  direction: 'prev' | 'next'
}

const buttonVariants = cva([
  'flex size-9 cursor-pointer items-center justify-center rounded-full',
  'bg-white',
  'focus-visible:ring focus-visible:outline-none',
])

const ICON_MAP = {
  prev: <CustomIcon icon={ChevronLeftIcon} />,
  next: <CustomIcon icon={ChevronRightIcon} />,
}

const CarouselNavigateButton = ({
  direction,
  className,
  ...props
}: CarouselNavigateButtonProps) => {
  return (
    <button
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      className={cn(buttonVariants(), className)}
      type='button'
      {...props}
    >
      <span className='sr-only'>
        {direction === 'prev' ? 'Previous' : 'Next'}
      </span>
      {ICON_MAP[direction]}
    </button>
  )
}

export { CarouselNavigateButton }
