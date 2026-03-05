/*
  Warnings:

  - A unique constraint covering the columns `[affiliateCode]` on the table `AffiliateProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AffiliateProfile" ADD COLUMN     "affiliateCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateProfile_affiliateCode_key" ON "AffiliateProfile"("affiliateCode");

-- CreateIndex
CREATE INDEX "AffiliateProfile_affiliateCode_idx" ON "AffiliateProfile"("affiliateCode");
