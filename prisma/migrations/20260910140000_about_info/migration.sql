-- CreateTable
CREATE TABLE "AboutInfo" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL DEFAULT '',
    "tagline" TEXT NOT NULL DEFAULT '',
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "fullDescription" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "addressNote" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "phoneSecondary" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL DEFAULT '',
    "telegram" TEXT NOT NULL DEFAULT '',
    "instagram" TEXT NOT NULL DEFAULT '',
    "vkontakte" TEXT NOT NULL DEFAULT '',
    "hoursWeekdays" TEXT NOT NULL DEFAULT '',
    "hoursWeekend" TEXT NOT NULL DEFAULT '',
    "hoursNote" TEXT NOT NULL DEFAULT '',
    "deliveryInfo" TEXT NOT NULL DEFAULT '',
    "deliveryZones" TEXT NOT NULL DEFAULT '',
    "minOrderNote" TEXT NOT NULL DEFAULT '',
    "paymentMethods" TEXT NOT NULL DEFAULT '',
    "parkingInfo" TEXT NOT NULL DEFAULT '',
    "howToFind" TEXT NOT NULL DEFAULT '',
    "mapUrl" TEXT NOT NULL DEFAULT '',
    "legalName" TEXT NOT NULL DEFAULT '',
    "unp" TEXT NOT NULL DEFAULT '',
    "foundedYear" TEXT NOT NULL DEFAULT '',
    "capacity" TEXT NOT NULL DEFAULT '',
    "amenities" TEXT NOT NULL DEFAULT '',
    "coverImageData" BYTEA,
    "coverImageMimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutPhoto" (
    "id" TEXT NOT NULL,
    "aboutId" INTEGER NOT NULL DEFAULT 1,
    "imageData" BYTEA NOT NULL,
    "imageMimeType" TEXT NOT NULL,
    "caption" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AboutPhoto_aboutId_sortOrder_idx" ON "AboutPhoto"("aboutId", "sortOrder");

-- AddForeignKey
ALTER TABLE "AboutPhoto" ADD CONSTRAINT "AboutPhoto_aboutId_fkey" FOREIGN KEY ("aboutId") REFERENCES "AboutInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed singleton row
INSERT INTO "AboutInfo" ("id", "updatedAt")
VALUES (1, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
