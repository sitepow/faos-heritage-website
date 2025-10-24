import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { FC } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
  stock?: number;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  description,
  category,
  stock = 0,
}) => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="p-0 overflow-hidden">
        <Image
          alt={name}
          className="object-cover w-full"
          classNames={{
            wrapper: "w-full",
          }}
          height={250}
          width="100%"
          radius="none"
          src={image}
        />
      </CardHeader>

      <CardBody className="px-4 py-3 flex-grow">
        <div className="flex flex-col gap-2 h-full">
          {category && (
            <p className="text-tiny text-default-500 uppercase font-bold">
              {category}
            </p>
          )}
          <h4 className="font-bold text-large">{name}</h4>
          <p className="text-default-500 text-small line-clamp-2 flex-grow">
            {description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <p className="text-2xl font-bold text-primary">
              ฿{price.toLocaleString()}
            </p>
            <p
              className={`text-small ${stock > 0 ? "text-success" : "text-danger"}`}
            >
              {stock > 0 ? `เหลือ ${stock} ชิ้น` : "สินค้าหมด"}
            </p>
          </div>
        </div>
      </CardBody>

      <Divider />

      <CardFooter className="px-4 py-3">
        <Button color="primary" className="w-full" isDisabled={stock === 0}>
          {stock > 0 ? "เพิ่มลงตะกร้า" : "สินค้าหมด"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ProductCard };
export type { ProductCardProps };
