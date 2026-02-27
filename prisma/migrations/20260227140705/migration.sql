-- AlterTable
ALTER TABLE "ShippingCountry" ADD COLUMN     "freeShippingThreshold" DECIMAL(12,2);

-- CreateTable
CREATE TABLE "ShippingWeightTier" (
    "id" TEXT NOT NULL,
    "shippingCountryId" TEXT NOT NULL,
    "minWeight" DECIMAL(10,3) NOT NULL,
    "maxWeight" DECIMAL(10,3) NOT NULL,
    "rate" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "ShippingWeightTier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShippingWeightTier_shippingCountryId_idx" ON "ShippingWeightTier"("shippingCountryId");

-- AddForeignKey
ALTER TABLE "ShippingWeightTier" ADD CONSTRAINT "ShippingWeightTier_shippingCountryId_fkey" FOREIGN KEY ("shippingCountryId") REFERENCES "ShippingCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
