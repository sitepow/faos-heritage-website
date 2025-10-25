"use client";

import { formatCurrency } from "@/utils/number";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { FC, useState } from "react";
import { ProductRating } from "./product-rating";
import { Product } from "@/types";
import clsx from "clsx";
import { Alert } from "@heroui/alert";

interface Props extends Product {
  className?: string;
}

const ProductCard: FC<Props> = ({ id, name, price, image, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={clsx(
        "size-full flex flex-col flex-none w-64 md:w-72 cursor-pointer border border-divider",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 overflow-hidden relative">
        <Image
          alt={name}
          className="object-cover size-full"
          classNames={{
            wrapper: "w-full",
          }}
          height={250}
          width="100%"
          radius="none"
          src={image ?? "/placeholder.svg"}
        />

        {isHovered && (
          <Alert
            radius="none"
            color="primary"
            className="absolute bottom-0 z-[60]"
            description="คลิกเพื่อดูรายละเอียดสินค้า"
          />
        )}
      </CardHeader>

      <CardBody>
        <p className="font-bold text-lg text-default-500">
          {formatCurrency(price)}
        </p>
        <h4 className="font-bold text-lg truncate">{name}</h4>
        <ProductRating rate={4} />
      </CardBody>
    </Card>
  );
};

export { ProductCard };
