-- CreateTable
CREATE TABLE "ProductLocalization" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,

    CONSTRAINT "ProductLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryLocalization" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CategoryLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariantLocalization" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductVariantLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductLocalization_productId_idx" ON "ProductLocalization"("productId");

-- CreateIndex
CREATE INDEX "ProductLocalization_languageCode_idx" ON "ProductLocalization"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProductLocalization_productId_languageCode_key" ON "ProductLocalization"("productId", "languageCode");

-- CreateIndex
CREATE INDEX "CategoryLocalization_categoryId_idx" ON "CategoryLocalization"("categoryId");

-- CreateIndex
CREATE INDEX "CategoryLocalization_languageCode_idx" ON "CategoryLocalization"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLocalization_categoryId_languageCode_key" ON "CategoryLocalization"("categoryId", "languageCode");

-- CreateIndex
CREATE INDEX "ProductVariantLocalization_variantId_idx" ON "ProductVariantLocalization"("variantId");

-- CreateIndex
CREATE INDEX "ProductVariantLocalization_languageCode_idx" ON "ProductVariantLocalization"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariantLocalization_variantId_languageCode_key" ON "ProductVariantLocalization"("variantId", "languageCode");

-- AddForeignKey
ALTER TABLE "ProductLocalization" ADD CONSTRAINT "ProductLocalization_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryLocalization" ADD CONSTRAINT "CategoryLocalization_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariantLocalization" ADD CONSTRAINT "ProductVariantLocalization_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
