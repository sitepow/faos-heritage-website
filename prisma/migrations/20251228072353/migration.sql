/*
  Warnings:

  - You are about to alter the column `discountValue` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `minPurchase` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `maxDiscount` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `subtotal` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `discount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `tax` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `shippingCost` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `total` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `price` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `subtotal` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(14,2)`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `compareAtPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `costPrice` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `weight` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,3)`.
  - You are about to alter the column `price` on the `ProductVariant` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `baseRate` on the `ShippingCountry` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `pricePerKg` on the `ShippingCountry` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - The `currency` column on the `ShippingCountry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `minWeight` on the `ShippingWeightTier` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,3)`.
  - You are about to alter the column `maxWeight` on the `ShippingWeightTier` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,3)`.
  - You are about to alter the column `pricePerKg` on the `ShippingWeightTier` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - A unique constraint covering the columns `[userId,productId,variantId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `countryCode` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'ISK', 'MYR', 'SGD', 'JPY', 'CNY', 'VND', 'IDR');

-- DropIndex
DROP INDEX "Address_userId_key";

-- DropIndex
DROP INDEX "Cart_userId_productId_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "discountValue" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "minPurchase" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "maxDiscount" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD',
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(14,2),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(14,2),
ALTER COLUMN "tax" SET DATA TYPE DECIMAL(14,2),
ALTER COLUMN "shippingCost" SET DATA TYPE DECIMAL(14,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(14,2);

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD',
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(14,2);

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "baseCurrency" "Currency" NOT NULL DEFAULT 'USD',
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "compareAtPrice" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "costPrice" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "weight" SET DATA TYPE DECIMAL(10,3);

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "image" TEXT,
ADD COLUMN     "weight" DECIMAL(10,3) NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "ShippingCountry" ALTER COLUMN "baseRate" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "pricePerKg" SET DATA TYPE DECIMAL(12,2),
DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "ShippingWeightTier" ALTER COLUMN "minWeight" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "maxWeight" SET DATA TYPE DECIMAL(10,3),
ALTER COLUMN "pricePerKg" SET DATA TYPE DECIMAL(12,2);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductPrice" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "currency" "Currency" NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "compareAtPrice" DECIMAL(12,2),

    CONSTRAINT "ProductPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductPrice_currency_idx" ON "ProductPrice"("currency");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPrice_productId_currency_key" ON "ProductPrice"("productId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPrice_variantId_currency_key" ON "ProductPrice"("variantId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_productId_variantId_key" ON "Cart"("userId", "productId", "variantId");

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
