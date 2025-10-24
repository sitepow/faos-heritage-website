import { formatCurrency } from "@/utils/number";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { FC } from "react";
import { StarRating } from "./star-rating";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  stock?: number;
}

const ProductCard: FC<ProductCardProps> = ({ id, name, price, image }) => {
  return (
    <Card className="size-full flex flex-col cursor-pointer border border-divider">
      <CardHeader className="p-0 overflow-hidden">
        <Image
          alt={name}
          className="object-cover size-full"
          classNames={{
            wrapper: "w-full",
          }}
          height={250}
          width="100%"
          radius="none"
          src={image}
        />
      </CardHeader>

      <CardBody>
        <p className="font-bold text-lg text-default-500">
          {formatCurrency(price)}
        </p>
        <h4 className="font-bold text-lg">{name}</h4>
        <StarRating rate={4} />
      </CardBody>
    </Card>
  );
};

export { ProductCard };
export type { ProductCardProps };
