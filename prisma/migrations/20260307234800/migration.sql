-- AlterEnum
ALTER TYPE "StockMovementType" ADD VALUE 'WITHDRAWAL';

-- AlterTable
ALTER TABLE "StockHistory" ADD COLUMN     "location" TEXT,
ADD COLUMN     "note" TEXT;

-- CreateIndex
CREATE INDEX "StockHistory_type_idx" ON "StockHistory"("type");
