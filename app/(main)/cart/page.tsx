import { CategorySection } from "@/components/category/category-section";
import { HeaderTitle } from "@/components/header-title";
import { NewsSection } from "@/components/news/news-section";
import { ProductSection } from "@/components/product/product-section";
import { PRODUCT_CONSTANT } from "@/utils/const";

export default function Cart() {
  return (
    <section className="flex flex-col text-center items-center justify-center gap-4">
      <CategorySection />

      <HeaderTitle
        title="เลือกสินค้าตามสไตล์"
        description="ค้นหาสินค้าที่ตรงใจและตอบโจทย์ความต้องการของคุณ"
      />

      <ProductSection items={PRODUCT_CONSTANT?.slice(0, 8)} />

      <NewsSection />
    </section>
  );
}
