-- CreateTable
CREATE TABLE "ShippingCountry" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "baseRate" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingWeightTier" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "minWeight" DOUBLE PRECISION NOT NULL,
    "maxWeight" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ShippingWeightTier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShippingCountry_isActive_idx" ON "ShippingCountry"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingCountry_countryCode_key" ON "ShippingCountry"("countryCode");

-- CreateIndex
CREATE INDEX "ShippingWeightTier_countryCode_idx" ON "ShippingWeightTier"("countryCode");
