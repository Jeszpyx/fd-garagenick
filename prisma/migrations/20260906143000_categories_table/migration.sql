-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT;

-- Migrate existing free-text categories into Category rows
INSERT INTO "Category" ("id", "name", "createdAt", "updatedAt")
SELECT
  'cat_' || md5(TRIM("category")),
  TRIM("category"),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM (
  SELECT DISTINCT TRIM("category") AS "category"
  FROM "Product"
  WHERE "category" IS NOT NULL AND TRIM("category") <> ''
) AS distinct_categories;

UPDATE "Product" AS p
SET "categoryId" = c."id"
FROM "Category" AS c
WHERE p."category" IS NOT NULL
  AND TRIM(p."category") = c."name";

-- DropIndex
DROP INDEX IF EXISTS "Product_category_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category";

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
