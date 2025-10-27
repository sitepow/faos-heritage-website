import clsx from 'clsx'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React from 'react'

import type { ComponentProps, FC } from 'react'

interface Props {
  direction: 'prev' | 'next'
}

const CarouselNavigatePlainButton: FC<Props & ComponentProps<'button'>> = ({
  direction,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'flex size-[48px] items-center justify-center',
        className,
      )}
      {...props}
    >
      <span className='sr-only'>{direction}</span>
      {direction === 'prev' ? (
        <ChevronLeftIcon className='size-[24px] text-white' />
      ) : (
        <ChevronRightIcon className='size-[24px] text-white' />
      )}
    </button>
  )
}

export default CarouselNavigatePlainButton
