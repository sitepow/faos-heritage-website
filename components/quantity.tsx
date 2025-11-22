import { Input } from '@heroui/input'
import { CircleMinus, CirclePlus } from 'lucide-react'

import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

const Quantity: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <CirclePlus className='shrink-0 cursor-pointer text-default-500' />
      <Input className='w-24' defaultValue='1' type='number' />
      <CircleMinus className='shrink-0 cursor-pointer text-default-500' />
    </div>
  )
}

export { Quantity }
