-- CreateTable
CREATE TABLE "BlogCategoryLocalization" (
    "id" TEXT NOT NULL,
    "blogCategoryId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BlogCategoryLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLocalization" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,

    CONSTRAINT "PostLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagLocalization" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TagLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryLocalization" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariantLocalization" (
    "id" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductVariantLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogCategoryLocalization_blogCategoryId_idx" ON "BlogCategoryLocalization"("blogCategoryId");

-- CreateIndex
CREATE INDEX "BlogCategoryLocalization_languageCode_idx" ON "BlogCategoryLocalization"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategoryLocalization_blogCategoryId_languageCode_key" ON "BlogCategoryLocalization"("blogCategoryId", "languageCode");

-- CreateIndex
CREATE INDEX "PostLocalization_postId_idx" ON "PostLocalization"("postId");

-- CreateIndex
CREATE INDEX "PostLocalization_languageCode_idx" ON "PostLocalization"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "PostLocalization_postId_languageCode_key" ON "PostLocalization"("postId", "languageCode");

-- CreateIndex
CREATE INDEX "TagLocalization_tagId_idx" ON "TagLocalization"("tagId");

-- CreateIndex
CREATE INDEX "TagLocalization_languageCode_idx" ON "TagLocalization"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "TagLocalization_tagId_languageCode_key" ON "TagLocalization"("tagId", "languageCode");

-- CreateIndex
CREATE INDEX "CategoryLocalization_categoryId_idx" ON "CategoryLocalization"("categoryId");

-- CreateIndex
CREATE INDEX "CategoryLocalization_languageCode_idx" ON "CategoryLocalization"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLocalization_categoryId_languageCode_key" ON "CategoryLocalization"("categoryId", "languageCode");

-- CreateIndex
CREATE INDEX "ProductVariantLocalization_productVariantId_idx" ON "ProductVariantLocalization"("productVariantId");

-- CreateIndex
CREATE INDEX "ProductVariantLocalization_languageCode_idx" ON "ProductVariantLocalization"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariantLocalization_productVariantId_languageCode_key" ON "ProductVariantLocalization"("productVariantId", "languageCode");

-- AddForeignKey
ALTER TABLE "BlogCategoryLocalization" ADD CONSTRAINT "BlogCategoryLocalization_blogCategoryId_fkey" FOREIGN KEY ("blogCategoryId") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLocalization" ADD CONSTRAINT "PostLocalization_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagLocalization" ADD CONSTRAINT "TagLocalization_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryLocalization" ADD CONSTRAINT "CategoryLocalization_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariantLocalization" ADD CONSTRAINT "ProductVariantLocalization_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
