import { ProductCard } from "@/components/product/product-card";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
        <ProductCard
          id="1"
          name="iPhone 15 Pro"
          price={39900}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          stock={15}
        />
        <ProductCard
          id="2"
          name="iPhone 15 Pro Max"
          price={44900}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          stock={15}
        />
        <ProductCard
          id="3"
          name="MacBook Pro"
          price={59900}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          stock={8}
        />
        <ProductCard
          id="4"
          name="AirPods Pro"
          price={8990}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          stock={0}
        />
        <ProductCard
          id="4"
          name="AirPods Pro"
          price={8990}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          stock={0}
        />
        <ProductCard
          id="4"
          name="AirPods Pro"
          price={8990}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          stock={0}
        />
        <ProductCard
          id="4"
          name="AirPods Pro"
          price={8990}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          stock={0}
        />
        <ProductCard
          id="4"
          name="AirPods Pro"
          price={8990}
          image="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          stock={0}
        />
      </div>
    </section>
  );
}
