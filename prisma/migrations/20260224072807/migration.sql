-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_viewCount_idx" ON "Product"("viewCount");
