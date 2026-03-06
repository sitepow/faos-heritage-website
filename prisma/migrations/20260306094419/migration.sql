-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "storefrontId" TEXT;

-- CreateTable
CREATE TABLE "Storefront" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "googleMapUrl" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "businessHours" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storefront_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Storefront_name_key" ON "Storefront"("name");

-- CreateIndex
CREATE INDEX "Storefront_isActive_idx" ON "Storefront"("isActive");

-- CreateIndex
CREATE INDEX "Order_storefrontId_idx" ON "Order"("storefrontId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storefrontId_fkey" FOREIGN KEY ("storefrontId") REFERENCES "Storefront"("id") ON DELETE SET NULL ON UPDATE CASCADE;
