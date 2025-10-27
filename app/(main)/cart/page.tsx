import { CartList } from './components/cart-list'
import { OrderSummary } from './components/order-summary'

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
        <CartList className='col-span-2' />
        <OrderSummary />
      </div>
    </section>
  )
}

export default Cart
