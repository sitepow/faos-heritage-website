import { NewsItem } from "@/types";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { FC } from "react";

const NewsCard: FC<NewsItem> = ({ id, description, title, image, link }) => {
  return (
    <Card fullWidth className="w-96 flex-none" shadow="none">
      <CardHeader>
        <Image
          className="object-cover size-full"
          classNames={{
            wrapper: "w-full",
          }}
          height={250}
          width="100%"
          src={image ?? "/placeholder.svg"}
        />
      </CardHeader>

      <CardBody className="flex-col gap-5">
        <span className="font-bold">{title}</span>

        <span>{description}</span>
      </CardBody>

      <CardFooter>
        <Button>อ่านต่อ</Button>
      </CardFooter>
    </Card>
  );
};

export { NewsCard };
