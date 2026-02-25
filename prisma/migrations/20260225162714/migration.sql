-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "PostLocalization" ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
