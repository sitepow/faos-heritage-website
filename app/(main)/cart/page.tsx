import { CartSection } from '../_components/cart/cart-section'
import { OrderSection } from '../_components/cart/order-section'

const Cart = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full justify-between'>
        <span className='text-xl font-bold'>ตระกร้าของคุณ (4 ชิ้น)</span>
        <span className='text-default-500 font-bold'>
          หมายเลขตระกร้าสินค้า #2514814107
        </span>
      </div>

      <div className='grid w-full grid-cols-3 gap-5'>
        <CartSection className='col-span-2' />
        <OrderSection />
      </div>
    </section>
  )
}

export default Cart
