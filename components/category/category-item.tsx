import { CategoryItem } from "@/types";
import { Card, CardBody } from "@heroui/card";
import { LayoutGrid } from "lucide-react";
import { FC } from "react";

interface CategoryMenuItemProps {
  item: CategoryItem;
}

const CategoryMenuItem: FC<CategoryMenuItemProps> = ({ item }) => {
  return (
    <Card shadow="sm" isHoverable className="cursor-pointer">
      <CardBody>
        <div className="flex gap-2.5">
          <LayoutGrid className="text-divider" />
          <span className="truncate">{item.name}</span>
        </div>
      </CardBody>
    </Card>
  );
};

export { CategoryMenuItem };
