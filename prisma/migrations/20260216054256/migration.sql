/*
  Warnings:

  - A unique constraint covering the columns `[referrerCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "referrerId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "referrerCode" TEXT;

-- CreateIndex
CREATE INDEX "Order_referrerId_idx" ON "Order"("referrerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_referrerCode_key" ON "User"("referrerCode");

-- CreateIndex
CREATE INDEX "User_referrerCode_idx" ON "User"("referrerCode");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("referrerCode") ON DELETE SET NULL ON UPDATE CASCADE;
