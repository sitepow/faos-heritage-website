import { Input } from '@heroui/input'
import { CircleMinus, CirclePlus } from 'lucide-react'

const StockInput = () => {
  return (
    <div className='flex items-center gap-2'>
      <CirclePlus className='cursor-pointer text-default-500' />
      <Input className='w-24' defaultValue='1' />
      <CircleMinus className='cursor-pointer text-default-500' />
    </div>
  )
}

export { StockInput }
