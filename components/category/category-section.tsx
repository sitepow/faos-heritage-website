import { ScrollShadow } from "@heroui/scroll-shadow";
import { CategoryMenuItem } from "./category-item";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Carousel } from "../carousel/carousel";
import { ProductCard } from "../product/product-card";
import { CATEGORY_CONSTANT, PRODUCT_CONSTANT } from "@/utils/const";
import { Button } from "@heroui/button";
import { ArrowRight } from "lucide-react";

const CategorySection = () => {
  return (
    <div className="flex gap-5 w-full h-[500px]">
      <ScrollShadow className="w-[300px] p-1">
        <div className="space-y-1">
          {CATEGORY_CONSTANT.map((category) => (
            <CategoryMenuItem key={category.id} item={category} />
          ))}
        </div>
      </ScrollShadow>

      <Card fullWidth>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <span className="font-bold">เสื้อผ้าแฟชั่น</span>

            <Button
              variant="light"
              endContent={<ArrowRight className="text-divider" />}
            >
              ดูทั้งหมด
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Carousel autoplay step={2} className="items-center">
            {PRODUCT_CONSTANT?.slice(0, 10).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}

            <Button>ดูทั้งหมด</Button>
          </Carousel>
        </CardBody>
      </Card>
    </div>
  );
};

export { CategorySection };
