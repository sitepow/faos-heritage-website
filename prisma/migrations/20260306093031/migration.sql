-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('SHIPPING', 'PICKUP');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'READY_FOR_PICKUP';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryType" "DeliveryType" NOT NULL DEFAULT 'SHIPPING',
ADD COLUMN     "pickupDate" TIMESTAMP(3),
ADD COLUMN     "pickupStoreLocation" TEXT;

-- CreateIndex
CREATE INDEX "Order_deliveryType_idx" ON "Order"("deliveryType");
