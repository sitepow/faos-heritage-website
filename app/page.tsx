import { ProductCard } from "@/components/product-card";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
        <ProductCard
          id="1"
          name="iPhone 15 Pro"
          price={39900}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          description="สมาร์ทโฟนรุ่นล่าสุด พร้อมชิป A17 Pro"
          category="มือถือ"
          stock={15}
        />
        <ProductCard
          id="2"
          name="iPhone 15 Pro Max"
          price={44900}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          description="สมาร์ทโฟนรุ่นล่าสุด พร้อมชิป A17 Pro และหน้าจอใหญ่ขึ้น"
          category="มือถือ"
          stock={15}
        />
        <ProductCard
          id="3"
          name="MacBook Pro"
          price={59900}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          description="โน้ตบุ๊กสำหรับมืออาชีพ"
          category="คอมพิวเตอร์"
          stock={8}
        />
        <ProductCard
          id="4"
          name="AirPods Pro"
          price={8990}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          description="หูฟังตัดเสียงรบกวนระดับพรีเมียม"
          category="Audio"
          stock={0}
        />
      </div>
    </section>
  );
}
