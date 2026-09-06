import { prisma } from "@/lib/prisma";

export type NotificationSettingsData = {
  adminEmails: string[];
  telegramChatIds: string[];
  updatedAt: string | null;
  providers: {
    telegramConfigured: boolean;
    smtpConfigured: boolean;
  };
};

export async function getOrCreateNotificationSettings() {
  return prisma.notificationSettings.upsert({
    where: { id: 1 },
    create: { id: 1, adminEmails: [], telegramChatIds: [] },
    update: {},
  });
}

export function getProviderStatus() {
  return {
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim()),
    smtpConfigured: Boolean(
      process.env.SMTP_HOST?.trim() &&
        process.env.SMTP_USER?.trim() &&
        process.env.SMTP_PASS?.trim(),
    ),
  };
}

export function serializeNotificationSettings(
  settings: {
    adminEmails: string[];
    telegramChatIds: string[];
    updatedAt: Date;
  },
): NotificationSettingsData {
  return {
    adminEmails: settings.adminEmails,
    telegramChatIds: settings.telegramChatIds,
    updatedAt: settings.updatedAt.toISOString(),
    providers: getProviderStatus(),
  };
}
