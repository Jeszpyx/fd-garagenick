-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "adminEmails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "telegramChatIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- Seed singleton row
INSERT INTO "NotificationSettings" ("id", "adminEmails", "telegramChatIds", "updatedAt")
VALUES (1, ARRAY[]::TEXT[], ARRAY[]::TEXT[], CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
