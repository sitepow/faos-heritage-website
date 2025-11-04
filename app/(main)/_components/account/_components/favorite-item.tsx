import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { ShoppingCart, Trash } from 'lucide-react'
import Image from 'next/image'

const FavoriteItem = () => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='grid grid-cols-3 items-center gap-4'>
        <div className='col-span-2 flex gap-4'>
          <Image
            alt='product-image'
            className='size-32'
            height={100}
            src='/placeholder.svg'
            width={100}
          />

          <div className='flex flex-col'>
            <span className='font-bold'>MICRON WARE</span>
            <span className='text-sm'>
              ล่องอเนกประสงค์ซ้อนได้พร้อมฝาล็อก MICRON WARE รุ่น JCP-6658 ความจุ
              10.5 ลิตร สีขาว
            </span>
            <span className='text-sm'>รหัสสินค้า : 60188416</span>

            <div className='mt-auto flex items-center justify-between'>
              <div className='text-red-800'>
                ฿<span className='text-2xl font-bold'>148</span>
                <span className='text-xs'> /EACH</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button startContent={<ShoppingCart />}>ใส่รถเข็น</Button>
          <Button startContent={<Trash />}>ลบจากรายการโปรด</Button>
        </div>
      </div>

      <Divider />
    </div>
  )
}

export { FavoriteItem }
