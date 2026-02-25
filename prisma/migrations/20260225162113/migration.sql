-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ProductLocalization" ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
