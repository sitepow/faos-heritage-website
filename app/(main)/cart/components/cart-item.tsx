import { formatNumber } from "@/utils/number";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import clsx from "clsx";
import { CircleMinus, CirclePlus, TrashIcon } from "lucide-react";
import Image from "next/image";
import { ComponentProps, FC } from "react";

const CartItem: FC<ComponentProps<typeof Card>> = ({ className, ...props }) => {
  return (
    <Card shadow="none" fullWidth className={clsx(className)} {...props}>
      <CardBody className="flex flex-row items-center justify-between gap-5">
        <Image
          src="/placeholder.svg"
          width={120}
          height={120}
          alt="product-image"
        />

        <div className="flex flex-col font-bold gap-2">
          <div className="flex gap-2">
            <span>
              หน้าต่างบานเลื่อนอะลูมิเนียม 2 บาน พร้อมมุ้งลวด SS WINKING ขนาด
              120 x 110 ซม. สีเทา
            </span>

            <TrashIcon className="text-default-500 cursor-pointer shrink-0" />
          </div>

          <div className="flex gap-2">
            <span className="text-default-500">รหัสสินค้า: 60429009</span>
            <span className="text-default-500">
              ราคา: {formatNumber(4399)}/each
            </span>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <span>จำนวน</span>

              <div className="flex items-center gap-2">
                <CirclePlus className="cursor-pointer text-default-500" />
                <Input className="w-24" defaultValue="1" />
                <CircleMinus className="cursor-pointer text-default-500" />
              </div>
            </div>

            <span className="text-2xl font-bold text-red-800">
              รวม {formatNumber(13900)}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export { CartItem };
