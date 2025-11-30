import { CartSection } from './_components/section/cart'
import { OrderSection } from './_components/section/order'

const Cart = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full flex-wrap justify-between'>
        <span className='text-xl font-bold'>ตระกร้าของคุณ (4 ชิ้น)</span>
        <span className='text-default-500'>หมายเลขตระกร้าสินค้า #2514814107</span>
      </div>

      <div className='grid w-full gap-5 lg:grid-cols-3'>
        <CartSection className='lg:col-span-2' />
        <OrderSection />
      </div>
    </section>
  )
}

export default Cart
