import { CartList } from "./components/cart-list";
import { OrderSummary } from "./components/order-summary";

export default function Cart() {
  return (
    <section className="flex flex-col text-center items-center justify-center gap-4">
      <div className="flex justify-between w-full">
        <span className="text-xl font-bold">ตระกร้าของคุณ (4 ชิ้น)</span>
        <span className="font-bold text-default-500">
          หมายเลขตระกร้าสินค้า #2514814107
        </span>
      </div>

      <div className="grid grid-cols-3 gap-5 w-full">
        <CartList className="col-span-2" />
        <OrderSummary />
      </div>
    </section>
  );
}
