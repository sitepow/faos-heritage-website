/*
  Warnings:

  - Added the required column `discountUsd` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingUsd` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalUsd` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxUsd` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalUsd` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceUsd` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotalUsd` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountUsd" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "exchangeRate" DECIMAL(18,8) NOT NULL DEFAULT 1,
ADD COLUMN     "exchangeRateSource" TEXT,
ADD COLUMN     "shippingCurrency" "Currency" NOT NULL DEFAULT 'USD',
ADD COLUMN     "shippingUsd" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "subtotalUsd" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "taxUsd" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "totalUsd" DECIMAL(14,2) NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "priceUsd" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "subtotalUsd" DECIMAL(14,2) NOT NULL;
