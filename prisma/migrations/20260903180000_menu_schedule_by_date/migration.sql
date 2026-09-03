-- DropIndex
DROP INDEX "MenuSchedule_dayOfWeek_idx";

-- DropIndex
DROP INDEX "MenuSchedule_productId_dayOfWeek_key";

-- AlterTable
ALTER TABLE "MenuSchedule" DROP COLUMN "dayOfWeek",
ADD COLUMN "date" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "MenuSchedule_date_idx" ON "MenuSchedule"("date");

-- CreateIndex
CREATE UNIQUE INDEX "MenuSchedule_productId_date_key" ON "MenuSchedule"("productId", "date");
