import { ProductCard } from "./product-card";
import { Product } from "@/types";
import { FC } from "react";

interface Props {
  items: Product[];
}

const ProductSection: FC<Props> = ({ items = [] }) => {
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4 w-full">
      {items?.map((product) => <ProductCard key={product.id} {...product} />)}
    </div>
  );
};

export { ProductSection };
