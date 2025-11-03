import { Button } from '@heroui/button'
import { Divider } from '@heroui/divider'
import { ShoppingCart, Trash } from 'lucide-react'
import Image from 'next/image'

const FavoriteItem = () => {
  return (
    <>
      <div className='flex items-center justify-between gap-4 p-2'>
        <div className='flex gap-5'>
          <Image
            alt='product-image'
            className='size-32'
            height={100}
            src='/placeholder.svg'
            width={100}
          />

          <div className='flex max-w-2xl flex-col'>
            <span className='leading-4 font-bold'>MICRON WARE</span>
            <span className='line-clamp-2 text-sm leading-4'>
              ล่องอเนกประสงค์ซ้อนได้พร้อมฝาล็อก MICRON WARE รุ่น JCP-6658 ความจุ
              10.5 ลิตร สีขาว
            </span>
            <span className='text-sm leading-4'>รหัสสินค้า : 60188416</span>

            <div className='mt-auto flex items-center justify-between'>
              <div className='text-right'>
                <div className='leading-3 text-red-800'>
                  ฿<span className='text-sm font-bold lg:text-2xl'>148</span>
                  <span className='text-xs'> /EACH</span>
                </div>
              </div>

              <div className='flex gap-2'>
                <Button startContent={<ShoppingCart />}>ใส่รถเข็น</Button>
                <Button startContent={<Trash />} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />
    </>
  )
}

export { FavoriteItem }
