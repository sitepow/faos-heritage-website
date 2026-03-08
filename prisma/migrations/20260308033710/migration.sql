-- AlterTable
ALTER TABLE "StockHistory" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "StockHistory_userId_idx" ON "StockHistory"("userId");

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
