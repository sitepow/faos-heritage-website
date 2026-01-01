-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isAuthentic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isPremiumProduct" BOOLEAN NOT NULL DEFAULT true;
