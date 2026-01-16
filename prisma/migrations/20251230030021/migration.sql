/*
  Warnings:

  - You are about to drop the column `baseCurrency` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductPrice` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[countryCode,minWeight,maxWeight]` on the table `ShippingWeightTier` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_variantId_fkey";

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "variantName" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "baseCurrency",
ALTER COLUMN "weight" DROP NOT NULL;

-- DropTable
DROP TABLE "ProductPrice";

-- CreateIndex
CREATE UNIQUE INDEX "ShippingWeightTier_countryCode_minWeight_maxWeight_key" ON "ShippingWeightTier"("countryCode", "minWeight", "maxWeight");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
