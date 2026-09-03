-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imageUrl",
ADD COLUMN "imageData" BYTEA,
ADD COLUMN "imageMimeType" TEXT;
