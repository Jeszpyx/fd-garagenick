import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";
import { notificationSettingsSchema } from "@/lib/validations";
import {
  getOrCreateNotificationSettings,
  serializeNotificationSettings,
} from "@/lib/services/settings";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const settings = await getOrCreateNotificationSettings();
    return apiSuccess(serializeNotificationSettings(settings));
  } catch {
    return apiError("Не удалось загрузить настройки", 500);
  }
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const parsed = notificationSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(
        parsed.error.issues[0]?.message ?? "Invalid settings",
        400,
      );
    }

    const adminEmails = [
      ...new Set(parsed.data.adminEmails.map((email) => email.toLowerCase())),
    ];
    const telegramChatIds = [
      ...new Set(parsed.data.telegramChatIds.map((id) => id.trim())),
    ];

    const settings = await prisma.notificationSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        adminEmails,
        telegramChatIds,
      },
      update: {
        adminEmails,
        telegramChatIds,
      },
    });

    return apiSuccess(serializeNotificationSettings(settings));
  } catch {
    return apiError("Не удалось сохранить настройки", 500);
  }
}
