import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ArrowRight } from "lucide-react";
import { NewsCard } from "./news-card";
import { Carousel } from "../carousel/carousel";
import { NEWS_CONSTANT } from "@/utils/const";

const NewsSection = () => {
  return (
    <Card fullWidth>
      <CardHeader className="justify-between">
        <span className="font-bold">ข่าวสารน่ารู้</span>

        <Button
          variant="light"
          endContent={<ArrowRight className="text-divider" />}
        >
          ดูทั้งหมด
        </Button>
      </CardHeader>

      <CardBody>
        <Carousel autoplay step={2}>
          {NEWS_CONSTANT.map((news) => (
            <NewsCard key={news.id} {...news} />
          ))}
        </Carousel>
      </CardBody>
    </Card>
  );
};

export { NewsSection };
