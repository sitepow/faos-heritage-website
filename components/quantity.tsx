import { NumberInput } from '@heroui/number-input'

import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

const Quantity: FC<ComponentProps<typeof NumberInput>> = ({
  className,
  ...props
}) => {
  return (
    <NumberInput
      className={cn('w-fit', className)}
      defaultValue={1}
      label='จำนวน'
      minValue={1}
      size='sm'
      {...props}
    />
  )
}

export { Quantity }
