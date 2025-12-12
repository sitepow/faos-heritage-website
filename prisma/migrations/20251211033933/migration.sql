-- CreateEnum
CREATE TYPE "ProductUnit" AS ENUM ('PIECE', 'ITEM', 'SET', 'BOX', 'PACK', 'BAG', 'BOTTLE', 'CAN', 'KG', 'G', 'L', 'ML', 'PAIR', 'ROLL', 'SHEET', 'UNIT', 'CAR', 'HOUSE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "unit" "ProductUnit" NOT NULL DEFAULT 'UNIT';
