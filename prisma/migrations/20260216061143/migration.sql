/*
  Warnings:

  - You are about to drop the column `referrerId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_referrerId_fkey";

-- DropIndex
DROP INDEX "Order_referrerId_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "referrerId",
ADD COLUMN     "referrerCode" TEXT;
