-- DropIndex
DROP INDEX "Category_slug_key";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "slug" DROP NOT NULL;
