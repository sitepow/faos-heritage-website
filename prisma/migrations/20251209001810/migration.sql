/*
  Warnings:

  - You are about to drop the column `guestEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `guestName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderNumber` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_orderNumber_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "guestEmail",
DROP COLUMN "guestName",
DROP COLUMN "orderNumber";
