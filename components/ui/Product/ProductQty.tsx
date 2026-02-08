/* eslint-disable no-unused-vars */
import { Button, Input } from '@heroui/react'
import { MinusIcon, PlusIcon } from 'lucide-react'

import type { InputProps } from '@heroui/react'

interface ProductQtyProps extends InputProps {
  quantity: number
  currentStockQuantity: number
  handleQuantityChange: (value: number) => void
}

const ProductQty = ({
  quantity,
  currentStockQuantity,
  handleQuantityChange,
  ...props
}: ProductQtyProps) => {
  const onIncrement = () => {
    if (quantity < currentStockQuantity) {
      handleQuantityChange(quantity + 1)
    }
  }

  const onDecrement = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1)
    }
  }

  return (
    <Input
      readOnly
      classNames={{
        input: 'text-center font-bold',
        inputWrapper:
          'p-0 h-10 overflow-hidden shadow-none border-default-100 data-[hover=true]:border-default-200 focus-within:!border-default-300',
      }}
      endContent={
        <Button
          isIconOnly
          className='border-default-100 h-full min-w-10 border-l'
          radius='none'
          size='sm'
          variant='light'
          onPress={onIncrement}
        >
          <PlusIcon />
        </Button>
      }
      radius='none'
      size='lg'
      startContent={
        <Button
          isIconOnly
          className='border-default-100 h-full min-w-10 border-r'
          isDisabled={quantity <= 1}
          radius='none'
          size='sm'
          variant='light'
          onPress={onDecrement}
        >
          <MinusIcon />
        </Button>
      }
      value={quantity.toString()}
      variant='bordered'
      {...props}
    />
  )
}

export { ProductQty }
