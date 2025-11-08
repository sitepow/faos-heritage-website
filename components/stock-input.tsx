import { Input } from '@heroui/input'
import { CirclePlus, CircleMinus } from 'lucide-react'

const StockInput = () => {
  return (
    <div className='flex items-center gap-2'>
      <CirclePlus className='text-default-500 cursor-pointer' />
      <Input className='w-24' defaultValue='1' />
      <CircleMinus className='text-default-500 cursor-pointer' />
    </div>
  )
}

export { StockInput }
